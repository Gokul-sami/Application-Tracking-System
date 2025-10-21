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
            className="cursor-target"
            type="url"
            placeholder="Paste your resume link"
            value={resumeLink}
            onChange={(e) => setResumeLink(e.target.value)}
            required
          />
          <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="w-50 cursor-target" type="submit" disabled={loading}>
            {loading ? "Applying..." : "Apply"}
          </button>
          <button className="w-50 cursor-target" onClick={onClose}>
            Cancel
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
