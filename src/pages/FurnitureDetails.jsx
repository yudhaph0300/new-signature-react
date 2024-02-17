import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import SpinnerFull from "../components/SpinnerFull";
import "../style/details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useAuthStatus } from "../hooks/useAuthStatus";

function FurnitureDetails() {
  const [loading, setLoading] = useState(true);
  const [furnitureDetails, setFurnitureDetail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const { userId } = useAuthStatus();

  useEffect(() => {
    const getDetails = async () => {
      const docRef = doc(db, "furnitures", params.furnitureId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFurnitureDetail(docSnap.data());
      } else {
        navigate("/furnitures");
        toast.error("Furniture doesnt exist");
      }
    };

    if (!furnitureDetails) {
      getDetails();
      setLoading(false);
    }
  }, [furnitureDetails, navigate, params.furnitureId]);

  const addFurnitureToCart = async (
    userId,
    furnitureId,
    image,
    name,
    price
  ) => {
    try {
      const cartRef = doc(db, "carts", userId);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        let { furnitures } = cartData || { furnitures: [] };

        if (
          Array.isArray(furnitures) &&
          !furnitures.some((item) => item.id === furnitureId)
        ) {
          const addFurniture = {
            id: furnitureId,
            image: image,
            name: name,
            price: price,
            quantity: 1,
            total: price,
          };
          furnitures = [...furnitures, addFurniture];
          await setDoc(cartRef, { furnitures }, { merge: true });
          toast.success("Furniture added to cart");

          navigate("/furnitures");
        } else {
          toast.error("Furniture already exists in cart");
        }
      } else {
        await createCartIfNotExists(userId);
        await addFurnitureToCart(userId, furnitureId, image, name, price);
      }
    } catch (error) {
      console.error("Error adding furniture to cart:", error);
    }
  };

  const createCartIfNotExists = async (userId) => {
    try {
      const cartRef = doc(db, "carts", userId);
      const cartData = {
        furnitures: [],
      };
      await setDoc(cartRef, cartData);
    } catch (error) {
      console.error("Error creating cart for user:", error);
    }
  };

  const handleAddToCart = async (image, name, price) => {
    if (window.confirm("Are you sure want to add this furniture to carts?")) {
      if (userId) {
        addFurnitureToCart(userId, params.furnitureId, image, name, price);
      }
    }
  };

  if (loading) {
    return <SpinnerFull />;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card p-3 shadow-lg">
          <div className="row">
            <div className="col-md-6">
              <div className="card-images-detail">
                {furnitureDetails?.imageURL.map((item, index) => (
                  <div className="image-wrapper" key={index}>
                    <img src={item} alt="..." />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <div className="my-2">
                <h5 className="fw-bold">Name: {furnitureDetails?.name}</h5>
                <p className="my-1">Type: {furnitureDetails?.type}</p>
                <p className="my-1">Price: {furnitureDetails?.price}</p>
                <p className="my-1">
                  Description: {furnitureDetails?.description}
                </p>
                <button
                  onClick={() =>
                    handleAddToCart(
                      furnitureDetails.imageURL[0],
                      furnitureDetails.name,
                      furnitureDetails.price
                    )
                  }
                  className="btn btn-primary mt-3 w-100 d-flex align-items-center justify-content-center"
                  disabled={!userId}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="me-2" />
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FurnitureDetails;
