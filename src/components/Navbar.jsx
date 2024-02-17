import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHistory,
  faRightToBracket,
  faTableColumns,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../asset/logo-white.png";

function Navbar() {
  const { loggedIn, checkingStatus, isAdmin } = useAuthStatus();

  return (
    <nav
      className="navbar navbar-expand-lg py-3"
      data-bs-theme="dark"
      style={{ backgroundColor: "#232454" }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="" height="30" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item me-3">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/furnitures" className="nav-link">
                Furnitures
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/readme" className="nav-link">
                Readme
              </Link>
            </li>

            <div className="line mx-3"></div>

            {checkingStatus ? (
              <Spinner />
            ) : (
              <>
                {loggedIn && !isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/history-transactions"
                        className="btn btn-warning btn-register-navbar"
                      >
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faHistory} className="me-2" />
                          History
                        </div>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/cart"
                        className="btn btn-primary btn-register-navbar"
                      >
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faCartShopping}
                            className="me-2"
                          />
                          Cart
                        </div>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/profile"
                        className="btn btn-success btn-register-navbar"
                      >
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Profile
                        </div>
                      </Link>
                    </li>
                  </>
                )}
                {loggedIn && isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/admin"
                        className="btn btn-dark btn-login-navbar"
                      >
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faTableColumns}
                            className="me-2"
                          />
                          Back to dashboard
                        </div>
                      </Link>
                    </li>
                  </>
                )}
                {!loggedIn && (
                  <>
                    <li className="nav-item me-3">
                      <Link
                        to="/login"
                        className="btn btn-primary btn-login-navbar"
                      >
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faRightToBracket}
                            className="me-2"
                          />
                          Login
                        </div>
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
