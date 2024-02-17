import { useEffect, useState } from "react";
import Sidebar from "../../../components/admin/Sidebar";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../../../firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerFull from "../../../components/SpinnerFull";

export default function Detail() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    creatorId: "",
    dataUser: {},
    furnitures: [],
    status: "",
    totalAmount: 0,
  });
  const { creatorId, dataUser, furnitures, status, totalAmount } = formData;

  const [edit, setEdit] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    const getDetail = async () => {
      const docRef = doc(db, "transactions", params.transactionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
        setLoading(false);
      } else {
        navigate("/admin/transactions");
        toast.error("Transaction doesnt exist");
      }
    };

    getDetail();
  }, [navigate, params.furnitureId, params.transactionId]);

  const onChange = (e) => {
    // Text/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataCopy = {
      status,
    };

    // Update listing
    const docRef = doc(db, "transactions", params.transactionId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    setEdit(false);
    toast.success("Transaction saved");
    navigate("/admin/transactions");
  };
  return (
    <>
      <Sidebar nav={"transactions"} />
      <div className="content">
        {loading ? (
          <SpinnerFull />
        ) : (
          <div className="card shadow border-0 p-3">
            <div className="card">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col text-start">
                    <h5 className="card-title fw-bold">Transaction Details</h5>
                  </div>
                  <div className="col text-end">
                    <button
                      className={`btn ${
                        edit ? "btn-danger" : "btn-warning"
                      } px-4`}
                      onClick={() => {
                        setEdit((prevState) => !prevState);
                      }}
                    >
                      {edit ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div className="border-all mb-3"></div>

                <form onSubmit={onSubmit} className="">
                  <h6 className="fw-bold">Info transaction</h6>
                  <div className="form-group mb-2">
                    <label className="small mb-1" htmlFor="status">
                      Status
                    </label>
                    <select
                      className="custom-select form-control small p-3"
                      name="status"
                      id="status"
                      onChange={onChange}
                      value={status}
                      disabled={!edit}
                    >
                      <option value="waiting">Waiting</option>
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                      <option value="completed">Completed</option>
                    </select>
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

                  {edit && (
                    <button
                      type="submit"
                      className="btn btn-success w-100 mt-3"
                    >
                      Save
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
