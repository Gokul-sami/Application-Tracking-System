import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/JobApplication.css";

const JobApplications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentMap, setCommentMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch job details
      const jobRes = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(jobRes.data);

      // Fetch applications
      const appsRes = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/job/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(appsRes.data.applications || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const comment = commentMap[id]?.trim();

    if (job?.jobType === "Non-technical" && (!comment || comment.length === 0)) {
      alert("Please add a comment before updating the status.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKENDURL}/admin/applications/${id}/status`,
        { status: newStatus, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentMap((prev) => ({ ...prev, [id]: "" }));
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentMap((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="applications-page">
      <header className="applications-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          Back
        </button>
        <h2>{job?.title || "Job"} Applications</h2>
      </header>

      {applications.length === 0 ? (
        <p className="no-apps">No applications for this job yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="applicant-info">
                <p><strong>Applicant Name:</strong> {app.name || app.applicantId?.name || "N/A"}</p>
                <p><strong>Email:</strong> {app.email || app.applicantId?.email || "N/A"}</p>
                <p>
                  <strong>Resume:</strong>{" "}
                  <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </p>
                <p><strong>Status:</strong> {app.status}</p>
              </div>

              {job?.jobType === "Non-technical" && (
                <div className="status-update">
                  <label>Update Status:</label>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <textarea
                    placeholder="Add a comment..."
                    value={commentMap[app._id] || ""}
                    onChange={(e) => handleCommentChange(app._id, e.target.value)}
                  />
                </div>
              )}

              <div className="history">
                <h4>History</h4>
                {app.history?.length === 0 ? (
                  <p>No history yet.</p>
                ) : (
                  <ul>
                    {app.history.map((h, i) => (
                      <li key={i}>
                        <span className="status">{h.status}</span> — {h.role} (
                        {new Date(h.timestamp).toLocaleDateString()})
                        <br />
                        <small>{h.comment}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
