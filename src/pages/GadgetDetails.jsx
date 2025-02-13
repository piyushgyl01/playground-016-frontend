import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsLoading from "../components/DetailsLoading";
import {
  fetchGadgetById,
  getAllGadgetStatuses,
  getGadgetById,
  updateGadget,
} from "../features/gadgetSlice";

export default function GadgetDetails() {
  //STATES
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    image: "",
    specs: {
      dimensions: "",
      category: "",
      price: 0,
      batteryLife: 0,
    },
    keyFeatures: [""],
  });

  //GETTING PRODUCT ID FROM USE PARAMS
  const { gadgetId } = useParams();

  //USE DISPATCH
  const dispatch = useDispatch();

  //SELECTING SINGLE PRODUCT FROM THE STATE
  const gadget = useSelector(getGadgetById);

  //GETTING STATUSES FROM THE STORE
  const { fetchByIdStatus, updateStatus } = useSelector(getAllGadgetStatuses);

  //FETCHING PRODUCT THROUGH ID
  useEffect(() => {
    dispatch(fetchGadgetById(gadgetId));
  }, [dispatch, gadgetId]);

  useEffect(() => {
    if (gadget) {
      setFormData({
        name: gadget.name || "",
        brand: gadget.brand || "",
        description: gadget.description || "",
        image: gadget.image || "",
        specs: {
          dimensions: gadget.specs?.dimensions || "",
          category: gadget.specs?.category || "",
          price: gadget.specs?.price || 0,
          batteryLife: gadget.specs?.batteryLife || 0,
        },
        keyFeatures: gadget.keyFeatures || [""],
      });
    }
  }, [gadget]);

  //USE EFFECT TO SHOW NOTIFCATIONS
  useEffect(() => {
    if (updateStatus === "success") {
      dispatch(fetchGadgetById(gadgetId));

      setMessage({
        show: true,
        text: "Gadget updated successfully",
        type: "success",
      });

      setIsEditing(false);

      const timer = setTimeout(() => {
        setMessage({ show: false, text: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    } else if (updateStatus === "error") {
      setMessage({
        show: true,
        text: "Failed to update the gadget",
        type: "danger",
      });
    }
  }, [dispatch, updateStatus, gadgetId]);

  //HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("specs.")) {
      const specsField = name.split(".")[1];
      const parsedValue = ["price", "batteryLife"].includes(specsField)
        ? parseFloat(value) || 0
        : value;

      setFormData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specsField]: parsedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  //HANDLE FEATURE CHANGE
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: newFeatures,
    }));
  };

  //HANDLE ADD FEATURE
  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""],
    }));
  };

  //HANDLE REMOVE FEATURE
  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  //HANDLE SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateGadget({ gadgetId, formData }));
  };

  return (
    <>
      {fetchByIdStatus === "loading" ? (
        <DetailsLoading />
      ) : (
        <main className="container my-5">
          {message.show && (
            <div className={`alert alert-${message.type} mb-3`}>
              {message.text}
            </div>
          )}

          <h1>Details of {gadget?.name}</h1>

          {isEditing ? (
            <div className="card">
              <div className="card-header">Edit {gadget?.name}</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      name="specs.dimensions"
                      className="form-control"
                      value={formData.specs.dimensions}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">category</label>
                    <select
                      name="specs.category"
                      className="form-select"
                      value={formData.specs.category}
                      onChange={handleChange}
                    >
                      <option value="Smart Home">Smart Home</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Audio">Audio</option>
                      <option value="Mobile Accessories">
                        Mobile Accessories
                      </option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      name="specs.price"
                      className="form-control"
                      value={formData.specs.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Battery Life</label>
                    <input
                      type="number"
                      name="specs.batteryLife"
                      className="form-control"
                      value={formData.specs.batteryLife}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Features</label>
                    {formData.keyFeatures.map((feature, index) => (
                      <div className="d-flex gap-2 mb-2" key={index}>
                        <input
                          type="text"
                          className="form-control"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-secondary"
                      onClick={handleAddFeature}
                      type="button"
                    >
                      Add Feature
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={updateStatus === "loading"}
                    >
                      {updateStatus === "loading" ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Change"
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={updateStatus === "loading"}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card mb-4 p-2">
              <div className="card-body">{gadget?.name}</div>
              <div className="card-body">
                <p>
                  <strong>Brand: </strong>
                  {gadget?.brand}
                </p>
                <p>
                  <strong>Description: </strong>
                  {gadget?.description}
                </p>
                <p>
                  <strong>Dimensions: </strong>
                  {gadget?.specs.dimensions}
                </p>
                <p>
                  <strong>Category: </strong>
                  {gadget?.specs.category}
                </p>
                <p>
                  <strong>Price: </strong>${gadget?.specs.price}
                </p>
                <p>
                  <strong>Battery Life: </strong>
                  {gadget?.specs.batteryLife}
                </p>
                <div className="mb-3">
                  <h6>Features</h6>
                  <ul>
                    {gadget?.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="row mb-2">
                  <button
                    className="card-link btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Details of {gadget?.name}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}
