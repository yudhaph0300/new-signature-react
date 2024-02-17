import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../firebase.config";

import SpinnerFull from "../../../components/SpinnerFull";
import Sidebar from "../../../components/admin/Sidebar";

import "../style/detail.css";
import { toast } from "react-toastify";

function Detail() {
  const [loading, setLoading] = useState(false);
  const [furniture] = useState(false);
  const [imageURLS, setImageURLS] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: 0,
    images: {},
    description: "",
  });
  const { name, type, price, images, description } = formData;

  const [edit, setEdit] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  useEffect(() => {
    if (furniture && furniture.userRef !== auth.currentUser.uid) {
      toast.error("You cant edit this furniture");
      navigate("/admin/furniture");
    }
  });

  useEffect(() => {
    setLoading(true);
    const getDetail = async () => {
      const docRef = doc(db, "furnitures", params.furnitureId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
        setImageURLS(docSnap.data().imageURL);
        setLoading(false);
      } else {
        navigate("/admin/furniture");
        toast.error("Furniture doesnt exist");
      }
    };

    getDetail();
  }, [navigate, params.furnitureId]);

  // Sets userRef to logged in user
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/admin/furniture");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onChange = (e) => {
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

    if (typeof images === "object" && images !== null) {
      const numberOfImages = Object.keys(images).length;

      if (numberOfImages > 4) {
        setLoading(false);
        toast.error("Max 4 images");
        return;
      }
    } else {
      setLoading(false);
      toast.error("Images are not properly set");
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

    // Update listing
    const docRef = doc(db, "furnitures", params.furnitureId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Furniture saved");
    navigate("/admin/furniture");
  };

  return (
    <div>
      <Sidebar nav={"furnitures"} />
      <div className="content">
        {loading ? (
          <SpinnerFull />
        ) : (
          <div className="card shadow border-0 p-3">
            <div className="card">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col text-start">
                    <h5 className="card-title fw-bold">Furniture Details</h5>
                  </div>
                  <div className="col text-end">
                    <button
                      className={`btn ${
                        edit ? "btn-danger" : "btn-warning"
                      } px-4`}
                      onClick={() => {
                        setEdit((prevState) => !prevState);
                      }}
                    >
                      {edit ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div className="border-all mb-3"></div>

                {!edit && (
                  <div className="card-images">
                    {imageURLS.map((image, index) => (
                      <div className="image-wrapper" key={index}>
                        <img src={image} alt={name} />
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={onSubmit} className="">
                  {edit && (
                    <>
                      <label className="formLabel">Images</label>
                      <p className="imagesInfo small">
                        Images data will be reset. Please enter a maximum of 4
                        images
                      </p>
                      <input
                        className="formInputFile"
                        type="file"
                        id="images"
                        name="images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                      />
                    </>
                  )}

                  <div className="form-group mt-3 mb-2">
                    <label htmlFor="name" className="small mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control small p-3"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={name}
                      disabled={!edit}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label className="small mb-1" htmlFor="type">
                      Type
                    </label>
                    <select
                      className="custom-select form-control small p-3"
                      name="type"
                      id="type"
                      onChange={onChange}
                      value={type}
                      disabled={!edit}
                    >
                      <option value="Chair">Chair</option>
                      <option value="Sofa">Sofa</option>
                      <option value="Desk">Desk</option>
                    </select>
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="price" className="small mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control small p-3"
                      id="price"
                      name="price"
                      placeholder="Enter your price"
                      value={price}
                      disabled={!edit}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="description" className="small mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="form-control small"
                      name="description"
                      rows="8"
                      onChange={onChange}
                      value={description}
                      disabled={!edit}
                    ></textarea>
                  </div>

                  {edit && (
                    <button type="submit" className="btn btn-success px-4">
                      Save
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detail;
