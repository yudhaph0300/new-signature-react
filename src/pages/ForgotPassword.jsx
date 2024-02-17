import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { checkingStatus, loggedIn } = useAuthStatus();
  const navigate = useNavigate();
  if (checkingStatus) return <Spinner />;
  if (loggedIn) return navigate("/profile");

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was send");
    } catch (error) {
      toast.error("Could not send reset email");
    }
  };
  return (
    <div className="login-form">
      <div className="container d-flex justify-content-center align-items-center h-100 mt-auto">
        <div className="card p-3 shadow-lg" style={{ minWidth: "50%" }}>
          <div className="card-body">
            <p className="card-title fw-bold text-center">Forgot Password</p>
            <h3 className="mt-4 mb-0 fw-bold">
              Welcome to <span style={{ color: "#007bff" }}>Signature</span>
            </h3>
            <p className="small">Enter your email to reset your password</p>
            <form onSubmit={onSubmit}>
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
                  onChange={onChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 mt-3">
                Send Reset Link
              </button>
            </form>

            <div className="mt-1 w-100 d-flex justify-content-center">
              <a href="/login" className="btn btn-link fw-bold small mx-auto">
                Back to login?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
