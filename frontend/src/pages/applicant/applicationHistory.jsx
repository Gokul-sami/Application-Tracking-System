import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/applicationHistory.css";

const ApplicationHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [id]);

//   fetch application details
  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/applicant/application/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplication(res.data);
    } catch (err) {
      console.error("Error fetching application:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!application)
    return (
      <div className="error">
        <button onClick={() => navigate(-1)} className="back-btn">Back</button>
        <p>Application not found.</p>
      </div>
    );

  return (
    <div className="application-history-page">
      <header className="history-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          Back
        </button>
        <h2>Application History</h2>
        .
      </header>

      <div className="application-details">
        <h3>{application.jobId?.title}</h3>
        <p><strong>Current Status:</strong> {application.status}</p>
        <p><strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>

        <h4>Status Updates</h4>
        <ul className="status-history">
          {application.history && application.history.length > 0 ? (
            application.history.map((h, idx) => (
              <li key={idx}>
                <strong>{h.status}</strong> — {new Date(h.date).toLocaleString()}
              </li>
            ))
          ) : (
            <p>No updates yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ApplicationHistory;
