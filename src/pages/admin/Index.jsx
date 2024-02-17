import "./style/index.css";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faChair,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

function Index() {
  const [transactions, setTransactions] = useState(null);
  const [furnitureData, setFurnitureData] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dataStatistic, setDataStatistic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDatatransactions = async () => {
      setLoading(true);
      try {
        const transactionsRef = collection(db, "transactions");
        const querySnap = await getDocs(transactionsRef);

        let dataTransaction = [];
        querySnap.forEach((doc) => {
          dataTransaction.push({ id: doc.id, data: doc.data() });
        });

        setTransactions(dataTransaction);

        let calculatedTotalIncome = 0;
        dataTransaction.forEach((transaction) => {
          if (transaction.data.status === "completed") {
            calculatedTotalIncome += transaction.data.totalAmount;
          }
        });
        setTotalIncome(calculatedTotalIncome);
      } catch (error) {
        toast.error("Error getting data transactions!");
      } finally {
        setLoading(false);
      }
    };

    // Panggil fungsi pengambilan data hanya jika transactions masih null
    if (!transactions) {
      getDatatransactions();
    }
  }, [transactions]);

  useEffect(() => {
    if (transactions) {
      // Inisialisasi objek untuk menyimpan jumlah status transaksi
      const statusCount = {
        waiting: 0,
        pending: 0,
        shipped: 0,
        delivered: 0,
        canceled: 0,
        completed: 0,
      };

      // Hitung jumlah setiap status transaksi
      transactions.forEach((transaction) => {
        const status = transaction.data.status;
        if (statusCount.hasOwnProperty(status)) {
          statusCount[status]++;
        }
      });

      // Ambil nilai dari statusCount dan masukkan ke dalam array untuk data chart
      const statusValues = Object.values(statusCount);
      const maxChartView = Math.max(...statusValues) + 5;

      const updateStatusValues = [...statusValues, maxChartView];

      setDataStatistic({
        labels: [
          "Waiting",
          "Pending",
          "Shipped",
          "Delivered",
          "Canceled",
          "Completed",
        ],
        datasets: [
          {
            label: "Transaction Status",
            backgroundColor: "rgb(25, 135, 84)",
            borderColor: "rgb(25, 135, 84)",
            data: updateStatusValues,
          },
        ],
      });
    }
  }, [transactions]);

  useEffect(() => {
    const getDatafurnitures = async () => {
      setLoading(true);
      try {
        const furnituresRef = collection(db, "furnitures");
        const querySnap = await getDocs(furnituresRef);

        let dataFurnitures = [];
        querySnap.forEach((doc) => {
          dataFurnitures.push({ id: doc.id, data: doc.data() });
        });

        setFurnitureData(dataFurnitures);
      } catch (error) {
        toast.error("Error getting data furnitures!");
      } finally {
        setLoading(false);
      }
    };

    if (!furnitureData) {
      getDatafurnitures();
    }
  }, [furnitureData]);

  return (
    <div>
      <Sidebar nav={"dashboard"} />
      <div className="content-header">
        <Header title="Dashboard" />
      </div>
      <div className="content">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      size="3x"
                      color="rgb(25, 135, 84)"
                      className="mx-auto"
                    />
                  </div>
                  <div className="col-md-8 text-center">
                    <p className="">Total Income</p>
                    <hr className="border mb-4" />
                    {loading ? (
                      <Spinner />
                    ) : (
                      <h5 className="fw-bold">$ {totalIncome}</h5>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faChair}
                      size="3x"
                      color="rgb(25, 135, 84)"
                      className="mx-auto"
                    />
                  </div>
                  <div className="col-md-8 text-center">
                    <p className="">Total Furniture</p>
                    <hr className="border mb-4" />
                    {loading ? (
                      <Spinner />
                    ) : (
                      <h5 className="fw-bold">{furnitureData?.length} Items</h5>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faArrowRightArrowLeft}
                      size="3x"
                      color="rgb(25, 135, 84)"
                      className="mx-auto"
                    />
                  </div>
                  <div className="col-md-8 text-center">
                    <p className="">Total Transaction</p>
                    <hr className="border mb-4" />
                    {loading ? (
                      <Spinner />
                    ) : (
                      <h5 className="fw-bold">{transactions?.length}</h5>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <div className="card shadow-lg">
              <div className="card-body">
                <h5 className="mb-3">Transaction data statistics</h5>
                {loading && <Spinner />}
                <div>
                  {!loading && dataStatistic && <Bar data={dataStatistic} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
