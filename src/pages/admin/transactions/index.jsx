import { useEffect, useState } from "react";
import Sidebar from "../../../components/admin/Sidebar";
import { db } from "../../../firebase.config";
import { collection, getDocs } from "@firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../../components/Spinner";
import { Link } from "react-router-dom";
import Header from "../../../components/admin/Header";

export default function Index() {
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const transactions = collection(db, "transactions");
        const querySnap = await getDocs(transactions);

        let data = [];
        querySnap.forEach((doc) => {
          data.push({ id: doc.id, data: doc.data() });
        });

        setTransactions(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching transactions:", error);
      }
    };

    if (!transactions) {
      fetchTransactions();
    }
  }, [transactions]);

  return (
    <>
      <Sidebar nav={"transactions"} />
      <div className="content-header">
        <Header title="Data Transaction" />
      </div>
      <div className="content">
        <div className="card shadow-lg p-3">
          <div className="card-body">
            <div className="card-title">
              <h3>Transactions</h3>
            </div>
          </div>
          {loading && <Spinner />}
          {!loading && transactions && (
            <div className="table-responsive">
              <table className="table table-hover ">
                <thead className="thead-light">
                  <tr>
                    <th className="text-center">No</th>
                    <th>Name</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{transaction.data.dataUser.name}</td>
                        <td>$ {transaction.data.totalAmount}</td>
                        <td>{transaction.data.status}</td>
                        <td className="text-center">
                          <Link
                            to={`/admin/transactions/${transaction.id}`}
                            className="btn btn-primary btn-circle me-2"
                          >
                            <FontAwesomeIcon icon={faInfo} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={"5"} className="text-center">
                        Transaction data is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
