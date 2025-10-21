import React, { useEffect, useState } from "react";
import axios from "axios";
import JobForm from "../../components/JobForm";
import { useNavigate } from "react-router-dom";
import TargetCursor from "../../components/TargetCursor.jsx";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const jobsRes = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/admin/job/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const appsRes = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/admin/applications/count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs(jobsRes.data || []);
      setApplicationsCount(appsRes.data.totalApplications || 0);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleJobCreated = (newJob) => {
    setJobs([...jobs, newJob]);
    setShowForm(false);
  };

  const handleViewApplications = (jobId) => {
    navigate(`/admin/job/${jobId}/applications`);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "auto";
  }, [showForm]);

  return (
    <div className="container py-4">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary cursor-target"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>Create Job
          </button>
          <button
            className="btn btn-danger cursor-target"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3 cursor-target">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="fw-bold">{jobs.length}</h3>
              <p className="text-muted mb-0">Total Jobs</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3 cursor-target">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="fw-bold">{applicationsCount}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-semibold mb-3">Jobs Overview</h4>

          {jobs.length === 0 ? (
            <p className="text-muted text-center">No jobs created yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Job Type</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Created On</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.jobType}</td>
                      <td>{job.location}</td>
                      <td>{job.salary ? `₹${job.salary}` : "N/A"}</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-link text-primary p-0 cursor-target"
                          onClick={() => handleViewApplications(job._id)}
                        >
                          View Applications &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Centered Modal */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1050,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{
              width: "60%",
              maxWidth: "850px",
              minHeight: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <JobForm
              onClose={() => setShowForm(false)}
              onJobCreated={handleJobCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
