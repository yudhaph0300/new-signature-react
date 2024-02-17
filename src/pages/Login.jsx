import "../style/login.css";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { toast } from "react-toastify";

// Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import SpinnerFull from "../components/SpinnerFull";
import OAuth from "../components/OAuth";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase.config";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const { checkingStatus, loggedIn } = useAuthStatus();
  if (checkingStatus) return <SpinnerFull />;
  if (loggedIn) return navigate("/profile");

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
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      toast.error("Bad Credentials");
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
            <p className="card-title fw-bold text-center">
              Sign in to your account
            </p>
            <h3 className="mt-4 mb-0 fw-bold">
              Welcome to <span style={{ color: "#007bff" }}>Signature</span>
            </h3>
            <p className="small">
              Enter your details to get sign in to your account
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
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

              <div className="my-2 w-100 d-flex justify-content-center">
                <a
                  href="/forgot-password"
                  className="btn btn-link fw-bold small mx-auto"
                >
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2">
                Login
              </button>
            </form>

            <OAuth />

            <div>
              <p className="text-center small">
                Don't have an account?{" "}
                <span>
                  <a href="/register">Register</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
