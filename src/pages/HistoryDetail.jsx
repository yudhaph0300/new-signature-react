import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import SpinnerFull from "../components/SpinnerFull";

export default function HistoryDetail() {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    creatorId: "",
    dataUser: {},
    furnitures: [],
    status: "",
    totalAmount: 0,
  });

  const { creatorId, dataUser, furnitures, status, totalAmount } = details;

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    const getDetail = async () => {
      const docRef = doc(db, "transactions", params.transactionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDetails(docSnap.data());
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/history-transactions");
        toast.error("Transaction doesnt exist");
      }
    };

    getDetail();
  }, [navigate, params.furnitureId, params.transactionId]);

  const howToPayRef = useRef();

  const scrollToHowToPay = () => {
    howToPayRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendWhatsAppMessage = () => {
    if (!params.transactionId || totalAmount === 0) {
      return;
    } else {
      const transactionID = params.transactionId;
      const amount = totalAmount;
      const message = `-Signature web-\n I will confirm payment with transaction ID ${transactionID} for ${amount}`;

      const phone = "6283833735915"; // Nomor WhatsApp tujuan

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <Navbar />
      {loading && <SpinnerFull />}
      {!loading && (
        <div className="container mt-5">
          <div className="card shadow-lg p-5">
            <div className="card-body">
              <div className="card-title">
                <div className="row">
                  <div className="col text-start">
                    <h5 className="card-title fw-bold">Transaction Details</h5>
                  </div>
                  <div className="col text-end">
                    <button
                      className="btn btn-primary px-4 me-3"
                      onClick={scrollToHowToPay}
                    >
                      How to pay
                    </button>
                    <button
                      className="btn btn-success px-4 "
                      onClick={sendWhatsAppMessage}
                    >
                      Payment confirmation
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-all mb-3"></div>
              <div>
                <h6 className="fw-bold">Info transaction</h6>
                <div className="form-group mb-2">
                  <label className="small mb-1" htmlFor="status">
                    Status
                  </label>
                  <input
                    type="text"
                    className="form-control small p-3"
                    id="status"
                    name="status"
                    value={status}
                    disabled
                  />
                </div>

                <div className="form-group mb-2">
                  <label htmlFor="totalAmount" className="small mb-1">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    className="form-control small p-3"
                    id="totalAmount"
                    name="totalAmount"
                    value={totalAmount}
                    disabled
                  />
                </div>

                <h6 className="fw-bold mt-4">Furniture Details</h6>
                {furnitures &&
                  furnitures.map((item, index) => (
                    <div className="form-group  mb-2" key={index}>
                      <input
                        type="text"
                        className="form-control small p-3"
                        name={item.name}
                        value={item.name}
                        disabled
                      />
                    </div>
                  ))}

                <h6 className="fw-bold mt-4">Customer Details</h6>

                <div className="form-group  mb-2">
                  <label htmlFor="creatorId" className="small mb-1">
                    Creator Id
                  </label>
                  <input
                    type="text"
                    className="form-control small p-3"
                    id="creatorId"
                    name="creatorId"
                    value={creatorId}
                    disabled
                  />
                </div>

                <div className="form-group  mb-2">
                  <label htmlFor="name" className="small mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control small p-3"
                    id="name"
                    name="name"
                    value={dataUser?.name}
                    disabled
                  />
                </div>

                <div className="form-group  mb-2">
                  <label htmlFor="address" className="small mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control small p-3"
                    id="address"
                    name="address"
                    value={dataUser?.address}
                    disabled
                  />
                </div>

                <div className="form-group  mb-2">
                  <label htmlFor="telp" className="small mb-1">
                    Telephone
                  </label>
                  <input
                    type="text"
                    className="form-control small p-3"
                    id="telp"
                    name="telp"
                    value={dataUser?.telp}
                    disabled
                  />
                </div>

                <div className="form-group  mb-2">
                  <label htmlFor="email" className="small mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control small p-3"
                    id="email"
                    name="email"
                    value={dataUser?.email}
                    disabled
                  />
                </div>

                <div className="how-to-pay" ref={howToPayRef}>
                  <h5 className="fw-bold mt-5">How to pay?</h5>
                  <ul>
                    <li className="mt-1">
                      Ensure that the transaction details match your order.
                    </li>
                    <li className="mt-1">
                      Make the payment to BRI bank account 7603-31-XXXXXX-XX-X
                      under the name of Mohammad Yudha Pamungkas.
                    </li>
                    <li className="mt-1">
                      Select the "Payment Confirmation" menu within the
                      transaction details.
                    </li>
                    <li className="mt-1">Send the proof of payment.</li>
                    <li className="mt-1">
                      Wait for confirmation from the admin.
                    </li>
                    <li className="mt-1">Done</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
