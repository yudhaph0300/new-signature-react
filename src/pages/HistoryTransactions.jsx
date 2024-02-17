import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function HistoryTransactions() {
  const [historyTransaction, setHistoryTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuthStatus();

  const fetchHistoryTransaction = async () => {
    setLoading(true);
    try {
      const transactionRef = collection(db, "transactions");
      const q = query(transactionRef, where("creatorId", "==", userId));
      const querySnap = await getDocs(q);

      let data = [];
      querySnap.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() });
      });

      setHistoryTransaction(data);
    } catch (error) {
      toast.error("Failed to get data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!historyTransaction && userId) {
      fetchHistoryTransaction();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyTransaction, userId]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow-lg p-5">
          <div className="card-body">
            <div className="cartd-title">
              <h3 className="fw-bold">History Transaction</h3>
              {loading && <Spinner />}
            </div>
            <hr className="border" />

            <table className="table table-striped table-borderless">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Total items</th>
                  <th scope="col">Total Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyTransaction?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.data.furnitures.length}</td>
                    <td>$ {item.data.totalAmount}</td>
                    <td>{item.data.status}</td>
                    <td>
                      <Link
                        to={`/history-transactions/${item.id}`}
                        className="btn btn-primary btn-circle me-2"
                      >
                        <FontAwesomeIcon icon={faInfo} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {historyTransaction?.length <= 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Transactions is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
