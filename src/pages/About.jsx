import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../style/about.css";
import logo from "../asset/logo.png";

function About() {
  return (
    <div className="container-about">
      <Navbar />
      <div className="about-container">
        <div className="background-image">
          <div className="image-text">
            <h1 className="fw-bold">Welcome to Signature</h1>
            <p>A Furniture Destination</p>
          </div>
        </div>
      </div>
      <div className="container mt-5 about-description">
        <>
          <section className="mt-4">
            <img src={logo} alt="Signature" height="60" />
            <p className="mt-2">
              <span className="fw-bold">Signature</span> was founded on March
              31, 2023, by Mohammad Yudha Pamungkas in the city of Malang, East
              Java, Indonesia. Born out of a passion for furniture craftsmanship
              and design, our goal is to curate an exquisite collection that
              reflects elegance, quality, and comfort.
            </p>
          </section>

          <section className="mt-4">
            <h4 className="fw-bold">Our Commitment</h4>
            <p>
              At <span className="fw-bold">Signature</span>, our commitment is
              to provide an unparalleled shopping experience. We meticulously
              handpick our furniture to offer diverse collections, catering to
              various tastes and interior decoration needs. Our focus remains on
              delivering quality and excellence.
            </p>
          </section>

          <section className="mt-4">
            <h4 className="fw-bold">Product Range</h4>
            <p>
              Explore our extensive range featuring{" "}
              <span className="fw-bold">plush sofas</span>,{" "}
              <span className="fw-bold">sophisticated tables</span>,{" "}
              <span className="fw-bold">luxurious chairs</span>, and{" "}
              <span className="fw-bold">eye-catching decorative accents</span>.
              With an assortment of materials including solid wood, metal,
              glass, and more, our collection harmonizes functionality with
              aesthetics, ensuring a perfect fit for your space.
            </p>
          </section>

          <section className="mt-4">
            <h4 className="fw-bold">Customer Satisfaction</h4>
            <p>
              We strive for{" "}
              <span className="fw-bold">customer satisfaction</span> by offering
              a seamless shopping journey. Our dedicated customer service team
              ensures a personalized experience. Delve into our diverse
              collection, backed by a secure and efficient purchasing process.
            </p>
          </section>

          <section className="mt-4">
            <h4 className="fw-bold">Inspiration for Spaces</h4>
            <p>
              Signature aspires to be your source of inspiration for creating
              remarkable spaces. Whether it's a{" "}
              <span className="fw-bold">cosy living room</span>, an{" "}
              <span className="fw-bold">elegant dining area</span>, or a{" "}
              <span className="fw-bold">serene bedroom</span>, our collection is
              designed to transform your vision into reality, harmonizing
              functionality with style.
            </p>
          </section>

          <p>
            Warm regards from the Signature team, where every piece of furniture
            tells its <span className="fw-bold">beautiful story</span>.
          </p>
        </>
      </div>

      <Footer />
    </div>
  );
}

export default About;
