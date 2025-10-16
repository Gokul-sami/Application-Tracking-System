import React, { useState } from "react";
import axios from "axios";
import "./ApplicationForm.css";

const ApplicationForm = ({ job, onClose, onApplied }) => {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const jobId = job._id;
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/applicant/job/apply/${jobId}`,
        { resumeLink },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onApplied(res.data);
      onClose();
    } catch (err) {
      console.error("Error applying for job:", err);
      alert(err.response?.data?.message || "Error applying for job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Apply for {job.title}</h3>
        <form onSubmit={handleSubmit}>
          <label>Resume Link</label>
          <input
            type="url"
            placeholder="Paste your resume link"
            value={resumeLink}
            onChange={(e) => setResumeLink(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Applying..." : "Apply"}
          </button>
        </form>
        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ApplicationForm;
