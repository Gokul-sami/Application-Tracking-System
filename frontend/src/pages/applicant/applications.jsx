import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/applicantApplications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleCardClick = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary"
        >
          ← Back
        </button>
        <h2 className="text-center flex-grow-1">My Applications</h2>
        <div style={{ width: "90px" }}></div>
      </div>

      {/* No applications */}
      {applications.length === 0 ? (
        <div className="alert alert-info text-center">
          You have not applied to any jobs yet.
        </div>
      ) : (
        <div className="row g-4">
          {applications.map((app) => (
            <div key={app._id} className="col-md-6 col-lg-4">
              <div
                className="card shadow-sm border-2 h-100 hover-shadow"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(app)}
              >
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    {app.jobId?.title || "Untitled Job"}
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Status:</strong> {app.status}
                  </p>
                  <p className="card-text">
                    <strong>Applied On:</strong>{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Application Details */}
      {showModal && selectedApp && (
        <div
          className="custom-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable w-25 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg border-0 rounded-3">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title text-primary">
                  {selectedApp.jobId?.title || "Application Details"}
                </h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-primary">{selectedApp.status}</span>
                </div>
                <div className="mb-3">
                  <strong>Applied On:</strong>{" "}
                  {new Date(selectedApp.createdAt).toLocaleDateString()}
                </div>

                {/* Application History */}
                {selectedApp.history && selectedApp.history.length > 0 && (
                  <div>
                    <h6 className="mb-3">Application History</h6>
                    <div className="timeline">
                      {selectedApp.history.map((entry, index) => (
                        <div
                          key={index}
                          className="mb-3 ps-3 border-start border-3 border-primary"
                        >
                          <div className="fw-bold">{entry.status}</div>
                          <small className="text-muted">
                            {new Date(entry.timestamp).toLocaleString()}
                          </small>
                          {entry.comments && (
                            <p className="mb-0 mt-1">{entry.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
