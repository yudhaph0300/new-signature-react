import { Link } from "react-router-dom";
import logo from "../asset/logo-white.png";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div
      className="container-fluid mt-5"
      style={{ backgroundColor: "#191919" }}
    >
      <div className="container text-white">
        <div className="row g-1 py-5 d-flex justify-content-center align-items-center">
          <div className="col-md-3">
            <Link to="/" className="footer-brand">
              <img src={logo} alt="" height="35" />
            </Link>
          </div>
          <div className="col-md-1">
            <div className="footer-line"></div>
          </div>
          <div className="col-md-8">
            <div className="footer-link">
              <ul>
                <li>
                  <Link to="/" className="list-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="list-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/furnitures" className="list-link">
                    Furnitures
                  </Link>
                </li>
                <li>
                  <Link to="/readme" className="list-link">
                    Readme
                  </Link>
                </li>
              </ul>
            </div>

            <div className="social mt-3">
              <Link
                to="https://www.instagram.com/yudha.pamungkas_/"
                target="blank"
                className="me-4 social-link"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </Link>
              <Link
                to="https://api.whatsapp.com/send?phone=6283833735915"
                target="blank"
                className="me-4 social-link"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="2x" />
              </Link>
            </div>
            <div className="support mt-2">Email: yudhapamungkas@gmail.com</div>
            <div className="copy-right mt-3">
              &copy; 2024 Signature - M Yudha Pamungkas. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
