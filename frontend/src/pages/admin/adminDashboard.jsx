import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminDashboard.css";
import JobForm from "../../components/JobForm";
import { useNavigate } from "react-router-dom";

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
      const jobsRes = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/job/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appsRes = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/applications/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // job applications page
  const handleViewApplications = (jobId) => {
    navigate(`/admin/job/${jobId}/applications`);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={() => setShowForm(true)} className="create-job-btn">
          Create Job
        </button>
      </header>

      <div className="admin-analytics">
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>Total Jobs</p>
        </div>
        <div className="stat-card">
          <h3>{applicationsCount}</h3>
          <p>Total Applications</p>
        </div>
      </div>

      {/* Jobs List Section */}
      <section className="jobs-section">
        <h3>Jobs Overview</h3>
        {jobs.length === 0 ? (
          <p>No jobs created yet.</p>
        ) : (
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Job Type</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Created on</th>
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
                      className="view-btn"
                      onClick={() => handleViewApplications(job._id)}
                    >
                      view applications  &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* create job */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <JobForm onClose={() => setShowForm(false)} onJobCreated={handleJobCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
