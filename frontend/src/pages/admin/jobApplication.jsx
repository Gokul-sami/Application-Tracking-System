import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TargetCursor from "../../components/TargetCursor.jsx";

const JobApplications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentMap, setCommentMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const cached = sessionStorage.getItem(`jobApplications-${jobId}`);
    if (cached) {
      const { job, applications } = JSON.parse(cached);
      setJob(job);
      setApplications(applications);
      setLoading(false);
      // ✅ Background refresh (non-blocking)
      fetchApplications(true);
    } else {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // ⚡ Fetch both job & applications in parallel
      const [jobRes, appsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `${import.meta.env.VITE_BACKENDURL}/admin/job/${jobId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const jobData = jobRes.data;
      const appData = appsRes.data.applications || [];

      setJob(jobData);
      setApplications(appData);

      // ✅ Cache results
      sessionStorage.setItem(
        `jobApplications-${jobId}`,
        JSON.stringify({ job: jobData, applications: appData })
      );
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const comment = commentMap[id]?.trim();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKENDURL}/admin/applications/${id}/status`,
        { status: newStatus, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update local state immediately (no full refetch)
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );

      setCommentMap((prev) => ({ ...prev, [id]: "" }));

      // ✅ Refresh cache
      const cached = JSON.parse(sessionStorage.getItem(`jobApplications-${jobId}`));
      if (cached) {
        const updated = {
          ...cached,
          applications: cached.applications.map((a) =>
            a._id === id ? { ...a, status: newStatus } : a
          ),
        };
        sessionStorage.setItem(`jobApplications-${jobId}`, JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentMap((prev) => ({ ...prev, [id]: value }));
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
    <div className="container py-4">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary cursor-target" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
        <h3 className="fw-bold mb-0">{job?.title || "Job"} Applications</h3>
        <button className="btn btn-outline-primary cursor-target" onClick={() => fetchApplications()}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="text-muted text-center">No applications for this job yet.</p>
      ) : (
        <div className="row">
          {applications.map((app) => (
            <div key={app._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body cursor-target">
                  <h5 className="fw-semibold">{app.name || app.applicantId?.name}</h5>
                  <p className="mb-1 text-muted">{app.email || app.applicantId?.email}</p>
                  <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                  <p className="mt-2">
                    <strong>Status:</strong> {app.status}
                  </p>

                  <div className="mt-3">
                    <label className="form-label fw-semibold">Update Status</label>
                    <select
                      className="form-select mb-2 cursor-target"
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
                      className="form-control cursor-target"
                      placeholder="Add a comment..."
                      value={commentMap[app._id] || ""}
                      onChange={(e) => handleCommentChange(app._id, e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <h6>History</h6>
                    {app.history?.length === 0 ? (
                      <p className="text-muted">No history yet.</p>
                    ) : (
                      <ul className="list-group">
                        {app.history.map((h, i) => (
                          <li key={i} className="list-group-item">
                            <strong>{h.status}</strong> — {h.role} (
                            {new Date(h.timestamp).toLocaleDateString()})
                            <br />
                            <small className="text-muted">{h.comment}</small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
