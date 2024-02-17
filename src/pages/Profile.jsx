import { useEffect, useState } from "react";

// Firebase
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const { checkingStatus, isAdmin } = useAuthStatus();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    address: "",
    telp: "",
  });

  useEffect(() => {
    const getDetail = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        navigate("/login");
        toast.error("User not logged in");
      }
    };

    getDetail();
  }, [auth.currentUser.uid, navigate]);

  if (isAdmin) return navigate("/admin");

  const { name, email, address, telp } = formData;

  const onLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update Display Name in Authentication
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Pastikan bahwa nilai yang akan disimpan tidak kosong atau undefined
      const dataToUpdate = {
        name,
        address: address || "", // Menghindari nilai undefined pada address
        telp: telp || "", // Menghindari nilai undefined pada telp
      };

      // Update firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, dataToUpdate);
      toast.success("Profile details updated successfully!");
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="card p-3 shadow-lg">
          <div className="card-body">
            {checkingStatus && <Spinner />}
            <div className="row">
              <div className="col text-start">
                <p className="card-title fw-bold">Personal profile</p>
              </div>
              <div className="col text-end">
                <button
                  onClick={onLogout}
                  className="btn btn-danger btn-register-navbar"
                >
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faSignOut} className="me-2" />
                    Logout
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit}>
              <div className="form-group mb-2">
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
                  disabled={!changeDetails}
                  onChange={onChange}
                />
              </div>

              <div className="form-group mb-2">
                <label htmlFor="telp" className="small mb-1">
                  Telephone
                </label>
                <input
                  type="number"
                  className="form-control small p-3"
                  id="telp"
                  name="telp"
                  placeholder="Enter your telp"
                  value={telp}
                  disabled={!changeDetails}
                  onChange={onChange}
                />
              </div>

              <div className="form-group mb-2">
                <label htmlFor="address" className="small mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control small p-3"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={address}
                  disabled={!changeDetails}
                  onChange={onChange}
                />
              </div>

              <div className="form-group mb-2">
                <label htmlFor="email" className="small mb-1">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control small p-3"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  disabled
                  onChange={onChange}
                />
              </div>
            </form>
            {changeDetails && (
              <button
                className="btn btn-success mt-3  w-100"
                onClick={(e) => {
                  onSubmit(e);
                  setChangeDetails((prevState) => !prevState);
                }}
              >
                Save
              </button>
            )}

            <button
              className={`btn ${
                changeDetails ? "btn-danger" : "btn-warning"
              } fw-bold w-100 mt-3 `}
              style={{ textDecoration: "none" }}
              onClick={() => {
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "Cancel" : "Change"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
