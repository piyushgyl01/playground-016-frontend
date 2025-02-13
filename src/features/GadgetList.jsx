import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingUi from "../components/LoadingUi.jsx";
import {
  deleteGadget,
  fetchAllGadgets,
  getAllGadgetStatuses,
  selectFilteredGadgets,
  setSearchFilter,
} from "./gadgetSlice.js";

export default function GadgetList() {
  //STATES
  const [message, setMessage] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const [deletingId, setDeletingId] = useState(null);
  const searchFilter = useSelector((state) => state.gadgets.searchFilter);

  //USE DISPATCH FUNCTION
  const dispatch = useDispatch();

  //USE SLECTOR TO GET ALL THE PRODUCTS FROM THE STORE
  const gadgets = useSelector(selectFilteredGadgets);

  //DISPATCHING API CALL
  useEffect(() => {
    dispatch(fetchAllGadgets());
  }, [dispatch]);

  //GETTING STATUS STATES FROM STORE
  const { fetchStatus, deleteStatus } = useSelector(getAllGadgetStatuses);

  //HANDLE DELETE EFFECT
  useEffect(() => {
    if (deleteStatus === "success") {
      setMessage({
        show: true,
        message: "Gadget deleted successfully",
        type: "success",
      });

      const timer = setTimeout(() => {
        setMessage({ show: false, message: "", type: "warning" });
      }, 3000);
      setDeletingId(null);

      return () => clearTimeout(timer);
    } else if (deleteStatus === "error") {
      setMessage({
        show: true,
        message: "Failed to delete the gadget",
        type: "warning",
      });
      setDeletingId(null);
    }
  }, [deleteStatus, deletingId]);

  //HANDLE DELETE FUNCTION
  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteGadget(id));
  };

  //HANDLE SEARCH CHANGE
  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value));
  };

  return (
    <>
      <h1>All Gadgets</h1>
      <div className="row">
        <div className="col-md-12">
          <input
            type="text"
            placeholder="Search gadgets"
            value={searchFilter}
            onChange={handleSearchChange}
            className="form-control my-4"
          />
        </div>
      </div>
      {fetchStatus === "loading" && (
        <div className="row">
          {[...Array(30)].map((_, index) => (
            <LoadingUi key={`loading-${index}`} />
          ))}
        </div>
      )}

      {fetchStatus === "error" && <p>Error occured while fetching the data</p>}
      {message.show && (
        <div className="row">
          <div className="col-md-12">
            <p
              className={
                message.type === "warning"
                  ? "bg-danger-subtle p-3 rounded"
                  : "bg-success-subtle p-3 rounded"
              }
            >
              {message.message}
            </p>
          </div>
        </div>
      )}
      <div className="row">
        {gadgets.map((gadget) => (
          <div className="col-md-4" key={gadget._id}>
            <div className="card mb-4 p-2">
              <div className="card-header">{gadget.name}</div>
              <div className="card-body">
                <p>
                  <strong>Brand: </strong>
                  {gadget.brand}
                </p>
                <p>
                  <strong>Dimensions: </strong>
                  {gadget.specs.dimensions}
                </p>
                <p>
                  <strong>Category: </strong>
                  {gadget.specs.category}
                </p>
                <p>
                  <strong>Price: </strong>${gadget.specs.price}
                </p>
                <p>
                  <strong>Battery Life: </strong>
                  {gadget.specs.batteryLife}
                </p>
                <div className="row mb-2">
                  <Link
                    className="card-link btn btn-primary px-4"
                    to={`gadget-details/${gadget.name}/${gadget._id}`}
                  >
                    See Details
                  </Link>
                </div>
                <div className="row">
                  <button
                    className="card-link btn btn-danger px-4"
                    onClick={() => handleDelete(gadget._id)}
                    disabled={deletingId === gadget._id}
                  >
                    {deletingId === gadget._id ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
