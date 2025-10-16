import React, { useState } from "react";
import axios from "axios";
import "./JobForm.css";

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
        `${import.meta.env.VITE_BACKENDURL}/admin/create-job`,
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
    <div className="job-form-container">
      <h3>Create a New Job</h3>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" onChange={handleChange} required />

        <label>Job Type</label>
        <select name="jobType" onChange={handleChange} value={formData.jobType}>
          <option value="Technical">Technical</option>
          <option value="Non-technical">Non-technical</option>
        </select>

        <label>Description</label>
        <textarea name="description" onChange={handleChange} required></textarea>

        <label>Location</label>
        <input type="text" name="location" onChange={handleChange} required />

        <label>Salary (₹)</label>
        <input type="number" name="salary" onChange={handleChange} />

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
