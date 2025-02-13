import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllGadgetStatuses, postGadget } from "../features/gadgetSlice";

export default function AddGadget() {
  //STATES
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

  //USE NAVIGATE
  const navigate = useNavigate();

  //USE DISPATCH
  const dispatch = useDispatch();

  //GETTING STATUSES FROM THE STORE
  const { addStatus } = useSelector(getAllGadgetStatuses);

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

    const cleanedFormData = {
      ...formData,
      keyFeatures: formData.keyFeatures.filter(
        (feature) => feature.trim() !== ""
      ),
    };

    try {
      await dispatch(postGadget(cleanedFormData)) 
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // USEFFECT TO STATUS CHANGES
  useEffect(() => {
    if (addStatus === "success") {
      setMessage({
        show: true,
        text: "Gadget added successfully",
        type: "success",
      });

      setFormData({
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

      const navigationTimer = setTimeout(() => {
        navigate("/");
      }, 2000);

      return () => clearTimeout(navigationTimer);
    }

    if (addStatus === "error") {
      setMessage({
        show: true,
        text: "Failed to add the gadget",
        type: "danger",
      });
    }
  }, [addStatus, navigate]);

  return (
    <main className="container my-5">
      <h1>Add New Gadget</h1>
      {message.show && (
        <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>
      )}
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
            <option value="Mobile Accessories">Mobile Accessories</option>
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
                onChange={(e) => handleFeatureChange(index, e.target.value)}
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
            disabled={addStatus === "loading"}
          >
            {addStatus === "loading" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding...
              </>
            ) : (
              "Add Gadget"
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
            disabled={addStatus === "loading"}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
