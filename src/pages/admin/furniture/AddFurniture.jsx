import { useState } from "react";
import Sidebar from "../../../components/admin/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRef } from "react";
import { useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import SpinnerFull from "../../../components/SpinnerFull";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { db } from "../../../firebase.config";

const AddFurniture = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    images: {},
    price: 0,
    description: "",
  });

  const { name, type, images, price, description } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/login");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (loading) {
    return <SpinnerFull />;
  }

  const onMutate = (e) => {
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (images.length > 4) {
      setLoading(false);
      toast.error("Max 4 images");
      return;
    }

    // Store image in database
    const storageImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },

          (error) => {
            reject(error);
          },

          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageURL = await Promise.all(
      [...images].map((image) => storageImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageURL,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;

    await addDoc(collection(db, "furnitures"), formDataCopy);

    setLoading(false);
    toast.success("Furniture Added");
    navigate(`/admin/furniture`);
  };

  return (
    <div>
      <Sidebar nav={"furnitures"} />
      <div className="content">
        <div className="card shadow border-0 p-4">
          <h3 className="mb-4 fw-bold">Create new furniture</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="text">Name</label>
              <input
                name="name"
                id="name"
                type="text"
                className="form-control"
                placeholder="Enter your product name"
                value={name}
                onChange={onMutate}
              />
            </div>

            <div className="input-group mb-3">
              <div className="input-group-prepend" style={{ width: "15%" }}>
                <label className="input-group-text" htmlFor="type">
                  Type
                </label>
              </div>
              <select
                className="custom-select form-control"
                name="type"
                id="type"
                onChange={onMutate}
                value={type}
              >
                <option selected>Select Type</option>
                <option value="Chair">Chair</option>
                <option value="Sofa">Sofa</option>
                <option value="Desk">Desk</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                className="form-control"
                placeholder="Enter your product price"
                onChange={onMutate}
                value={price}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="images">Images</label>
              <input
                id="images"
                name="images"
                type="file"
                className="form-control"
                onChange={onMutate}
                accept=".jpg,.png,.jpeg"
                multiple
                max="4"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-control"
                name="description"
                rows="3"
                onChange={onMutate}
                value={description}
              ></textarea>
            </div>

            <div className="text-end">
              <Link
                to="/admin/furniture"
                className="btn btn-outline-danger me-2 px-4"
              >
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary px-4">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFurniture;
