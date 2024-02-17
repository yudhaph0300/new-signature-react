import "../style/cart.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../firebase.config";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [carts, setCarts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  const { userId, dataUser } = useAuthStatus();

  const getDetail = async () => {
    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cartData = docSnap.data();
      setCarts(cartData);

      setLoading(false);
    } else {
      await createCartIfNotExists(userId);
      await getDetail();
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

  useEffect(() => {
    if (userId) {
      getDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, totalAmount]);

  useEffect(() => {
    if (carts) {
      const newTotal = carts?.furnitures.reduce(
        (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
        0
      );

      setTotalAmount(newTotal);
    }
  }, [carts]);

  const deleteCartItem = async (userId, furnitureId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cartData = docSnap.data();
        const { furnitures } = cartData || { furnitures: [] };

        // Filter furnitures array untuk menghapus furniture dengan ID tertentu
        const updatedFurnitures = furnitures.filter(
          (furniture) => furniture.id !== furnitureId
        );

        // Update dokumen di Firestore dengan array yang sudah dimodifikasi
        await setDoc(
          docRef,
          { furnitures: updatedFurnitures },
          { merge: true }
        );

        getDetail();
        toast.success("Successfully deleted furniture from carts");
      }
    } else {
      toast.error("Cart does not exist for user:", userId);
    }
  };

  const updateQuantity = async (furnitureId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    const docRef = doc(db, "carts", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cartData = docSnap.data();
      const { furnitures } = cartData || { furnitures: [] };

      const updatedFurnitures = furnitures.map((furniture) => {
        if (furniture.id === furnitureId) {
          return {
            ...furniture,
            quantity: newQuantity,
            total: newQuantity * furniture.price,
          };
        }
        return furniture;
      });

      await setDoc(docRef, { furnitures: updatedFurnitures }, { merge: true });
      getDetail(); // Memperbarui data keranjang setelah perubahan
    } else {
      toast.error("Cart does not exist for user:", userId);
    }
  };

  const navigate = useNavigate();
  const createTransaction = async () => {
    setLoading(true);
    if (!dataUser?.address || !dataUser.telp) {
      return (
        navigate("/profile"),
        toast.error("Please update your profile"),
        setLoading(false)
      );
    }
    if (carts?.furnitures.length >= 1 && dataUser) {
      try {
        const transactionData = {
          furnitures: carts.furnitures,
          totalAmount: totalAmount,
          status: "waiting",
          creatorId: userId,
          dataUser: dataUser,
        };

        const docRef = doc(db, "transactions", uuidv4());
        await setDoc(docRef, transactionData);

        toast.success("Transaction created successfully!");
        setCarts(null);

        // Kosongkan furnitures di Firestore
        const cartDocRef = doc(db, "carts", userId);
        await setDoc(cartDocRef, { furnitures: [] }, { merge: true });
      } catch (error) {
        toast.error("Error creating transaction");
        // console.error("Error creating transaction: ", error);
      } finally {
        getDetail();
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-body p-5">
            <div className="row">
              <div className="col-md-6">
                <h3 className="fw-bold">Shopping Cart</h3>
              </div>
              <div className="col-md-6 text-end">
                <h5 className="fw-bold">{carts?.furnitures.length} Items</h5>
              </div>
            </div>
            <hr className="border" />

            <table className="table table-striped table-borderless">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Total</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {carts &&
                  carts.furnitures.map((cart, index) => (
                    <tr className="align-middle" key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <img src={cart.image} alt="" className="chart-thumb" />
                      </td>
                      <td>{cart.name}</td>
                      <td>
                        <button
                          onClick={() =>
                            updateQuantity(cart.id, cart.quantity - 1)
                          }
                          className="btn btn-outline-secondary btn-circle me-2"
                          disabled={cart.quantity <= 1}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        {cart.quantity}
                        <button
                          onClick={() =>
                            updateQuantity(cart.id, cart.quantity + 1)
                          }
                          className="btn btn-outline-secondary btn-circle ms-2"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </td>
                      <td>$ {cart.price}</td>
                      <td>$ {cart.total}</td>
                      <td>
                        <button
                          onClick={() => deleteCartItem(userId, cart.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                {carts?.furnitures.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Cart is empty
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <Spinner />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="row mt-5">
              <div className="col-md-6">
                <h5>Total to be paid: $ {totalAmount}</h5>
              </div>
              <div className="col-md-6">
                <button
                  onClick={createTransaction}
                  className="btn btn-primary w-100"
                  disabled={carts?.furnitures.length === 0}
                >
                  Order now
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

export default Cart;
