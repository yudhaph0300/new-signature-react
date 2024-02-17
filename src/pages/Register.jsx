import "../style/login.css";
import { Eye, EyeSlash } from "react-bootstrap-icons";

// Firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

// React
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData, isAdmin: false };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      toast.error("Something when wrong with registration");
    }
  };

  return (
    <div className="login-form">
      <div className="container d-flex justify-content-center align-items-center h-100 mt-auto">
        <div
          className="card p-3 shadow-lg"
          style={{ minWidth: "50%", maxWidth: "90%" }}
        >
          <div className="card-body">
            <h5 className="card-title fw-bold text-center">Important Note!</h5>
            <p className="small mb-0">
              Please make sure to read the <Link to="/readme">README</Link> page
              before attempting to use the application. The README contains
              essential information, guidelines, and instructions necessary for
              a smooth experience and understanding of the application's
              functionalities.
            </p>
          </div>

          <hr className="border mx-3" />

          <div className="card-body">
            <p className="card-title fw-bold text-center">Create an account</p>
            <h3 className="mt-4 mb-0 fw-bold">
              Welcome to <span style={{ color: "#007bff" }}>Signature</span>
            </h3>
            <p className="small">Enter your details to create your account</p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="small" for="name">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control small py-2"
                  id="name"
                  name="name"
                  placeholder="Enter your name here"
                  value={name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group mt-2">
                <label className="small" for="email">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control small py-2"
                  id="email"
                  name="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group mt-2">
                <label className="small" for="password">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control small py-2"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-4 py-2">
                Register
              </button>
            </form>

            <OAuth />

            <div>
              <p className="text-center small">
                Already have an account?{" "}
                <span>
                  <a href="/login">Login</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
