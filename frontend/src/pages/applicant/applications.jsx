import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/applicantApplications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/applicant/my-application`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-applications-page">
      <header className="applications-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          Back
        </button>
        <h2>My Applications</h2>
        .
      </header>

      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <div className="applications-grid">
          {applications.map((app, idx) => {
            const id = app._id;
            const isLastOdd = applications.length % 2 === 1 && idx === applications.length - 1;
            return (
              <div
                key={app._id}
                className={`application-card ${isLastOdd ? "large-card" : ""}`}
                onClick={() => navigate(`/applicant/application/${id}`)}
              >
                <h3>{app.jobId?.title}</h3>
                <p><strong>Status:</strong> {app.status}</p>
                <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
