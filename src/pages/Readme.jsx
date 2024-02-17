import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Readme = () => {
  return (
    <>
      <Navbar />

      <div className="container my-5" style={{ padding: "0 15%" }}>
        <div className="card shadow-lg p-4 mb-4" style={{ border: "0" }}>
          <div className="card-body">
            <h3 className="card-title fw-bold mb-4">Functionality</h3>

            <h5 className="fw-bold ">Admin :</h5>
            <p>
              As an admin, there are several features accessible to manage data
              and activities within our system. The completed functionalities
              include:
            </p>
            <p className="fw-bold">Completed:</p>
            <ul>
              <li>
                Login: Enables admin to access the admin account and perform
                CRUD (Create, Read, Update, Delete) operations on data.
              </li>
              <li>
                View All Furniture Data: Enables the viewing of all available
                furniture data within the system.
              </li>
              <li>
                View Furniture Details: Provides the ability to explore detailed
                information regarding specific furniture data.
              </li>
              <li>
                Furniture Data Search: Allows the search or filtering of
                furniture data based on specific criteria.
              </li>
              <li>
                Create New Furniture Data: Enables the addition of new furniture
                data into the system.
              </li>
              <li>
                Delete Furniture Data: Allows the removal of unnecessary
                furniture data from the system.
              </li>
              <li>
                Edit Furniture Data: Currently in development, allowing admins
                to modify existing furniture data as required.
              </li>
              <li>
                Transactions: Planned for future development to enable admins to
                confirm orders placed by customers before further processing.
              </li>
            </ul>
            <p className="fw-bold">In Progress:</p>
            <ul>
              <li>
                Dashboard: Under development to present a concise overview of
                system statistics or essential information.
              </li>
              <li>
                Settings: In the process of development to allow admins to
                configure system settings.
              </li>
            </ul>
            <p className="fw-bold">Future Development:</p>
            <ul>
              <li>-</li>
            </ul>
            <hr className="border mb-4" />

            <h5 className="fw-bold">Customer :</h5>
            <p>
              Customers have access to several features within our system to
              enhance their experience. The completed functionalities include:
            </p>
            <p className="fw-bold">Completed:</p>
            <ul>
              <li>
                Register: Enables customers to create an account within the
                system.
              </li>
              <li>
                Login: Allows customers to securely access their accounts.
              </li>
              <li>
                Forgot Password: Provides a process to reset forgotten passwords
                securely.
              </li>
              <li>
                Login/Register with Gmail: Allows customers to use their Gmail
                accounts for login or registration.
              </li>
              <li>
                View Furniture Data: Grants access to view available furniture
                data in the system.
              </li>
              <li>
                Search Furniture: Facilitates searching and filtering of
                furniture items.
              </li>
              <li>
                Edit Profile: Allows customers to modify their profile
                information.
              </li>
              <li>
                View Furniture Details: Currently in development, enabling
                customers to view detailed information about specific furniture
                items.
              </li>
              <li>
                Add Products to Cart: Planned for future development, allowing
                customers to add products to their shopping cart for potential
                purchase.
              </li>
              <li>
                Complete Product Purchase Transactions: Planned for future
                development, enabling customers to finalize transactions and
                purchase selected products.
              </li>
              <li>Make a history transactions</li>
            </ul>
            <p className="fw-bold">In Progress:</p>
            <ul>
              <li>-</li>
            </ul>
            <p className="fw-bold">Future Development:</p>
            <ul>
              <li>-</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-lg p-4 mb-4" style={{ border: "0" }}>
          <div className="card-body">
            <h3 className="card-title fw-bold mb-4">Pages</h3>

            <p>
              In this section, we'll outline the various pages available for
              customers within the system. Please find below the details and
              functionalities of each page designed specifically for customers'
              interactions and experiences.
            </p>

            <h5 className="card-title fw-bold">Customer Pages:</h5>
            <p className="card-title fw-bold">Login for Customers:</p>
            <ul>
              <li>
                Description: This page allows customers to sign in to their
                accounts.
              </li>
              <li>
                To Try: Go to <Link to={"/login"}>Login page</Link> and you can
                try logging in as a customer using the email "signature@test.co"
                with the password "signature". Alternatively, you can register
                to create a new account.
              </li>
            </ul>

            <p className="card-title fw-bold">Register Page for Customers:</p>
            <ul>
              <li>
                Description: This page enables customers to create a new account
                within the system.
              </li>
              <li>
                To Try: Go to <Link to={"/register"}>Register page</Link> and
                you can register to create a new account as a customer.
              </li>
            </ul>
            <hr className="border mb-4" />

            <h5 className="card-title fw-bold">Admin Pages:</h5>
            <p className="card-title fw-bold">Login for Admins:</p>
            <ul>
              <li>
                Description: This page enables admins to sign in to their admin
                accounts.
              </li>
              <li>
                To Try: Go to <Link to={"/login"}>Login page</Link> and you can
                try logging in as an admin using the email
                "signature-admin@test.co" with the password "signature".
              </li>
            </ul>

            <p className="card-title fw-bold">Admin Dashboard:</p>
            <ul>
              <li>
                Description: This page provides a summary of important data and
                statistics related to the system for admins.
              </li>
              <li>
                To Try: After successfully logging in as an admin, you can
                explore admin features such as CRUD (Create, Read, Update,
                Delete) for specific data.
              </li>
            </ul>

            <hr className="border mb-4" />
            <h5 className="card-title fw-bold">Note:</h5>
            <ul>
              <li>
                To log in as a customer or admin, use the provided account
                information.
              </li>
              <li>
                When trying out other features, make sure to follow the
                instructions available on each page and perform actions in the
                context of your system.
              </li>
              <li>
                If there is a bug, please report it to WhatsApp 083833735915
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Readme;
