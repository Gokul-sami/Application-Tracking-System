import React, { useState } from "react";
import axios from "axios";

const JobForm = ({ onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    jobType: "Technical",
    description: "",
    location: "",
    salary: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/admin/job/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onJobCreated(res.data.job);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h4 className="fw-bold mb-4 text-center border-bottom pb-2">
        Create a New Job
      </h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control border-3 rounded-3 cursor-target"
                style={{ boxShadow: "none", outline: "none" }}
                name="title"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Job Type</label>
              <select
                name="jobType"
                className="form-control border-3 rounded-3 cursor-target"
                onChange={handleChange}
                value={formData.jobType}
              >
                <option value="Technical">Technical</option>
                <option value="Non-technical">Non-technical</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                className="form-control border-3 rounded-3 cursor-target"
                style={{ boxShadow: "none", outline: "none" }}
                name="location"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Salary (₹)</label>
              <input
                type="number"
                className="form-control border-3 rounded-3 cursor-target"
                style={{ boxShadow: "none", outline: "none" }}
                name="salary"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control border-3 rounded-3 cursor-target"
                style={{ boxShadow: "none", outline: "none" }}
                rows="5"
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
          <button
            type="button"
            className="btn btn-outline-secondary px-4 cursor-target"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4 cursor-target"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
