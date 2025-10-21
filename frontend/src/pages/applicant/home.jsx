import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard";
import ApplicationForm from "../../components/ApplicationForm";
import TargetCursor from "../../components/TargetCursor";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("username");
      if (userData) setUser(userData);
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const jobsRes = await axios.get(`${import.meta.env.VITE_BACKENDURL}/applicant/job/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleApplied = () => {
    setShowForm(false);
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
      {/* Header Section */}
      <header className="mb-4 text-center">
        <h1 className="fw-bold mb-3">Welcome Back, {user}</h1>
        <p className="text-muted mb-4">Explore jobs and apply to the ones that fit you best.</p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-primary cursor-target"
            onClick={() => navigate("/applicant/my-applications")}
          >
            <i className="bi bi-briefcase-fill me-2"></i>My Applications
          </button>
          <button
            className="btn btn-outline-danger cursor-target"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              navigate("/");
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </header>

      {/* Jobs Section */}
      <section>
        <h2 className="fw-semibold mb-3">Available Jobs</h2>
        {jobs.length === 0 ? (
          <div className="text-center text-muted py-5 border rounded bg-light">
            No jobs available currently.
          </div>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div className="col-md-6 col-lg-4" key={job._id}>
                <JobCard job={job} onApplyClick={handleApplyClick} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Application Form Modal */}
      {showForm && selectedJob && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="modal-body">
                <ApplicationForm
                  job={selectedJob}
                  onClose={() => setShowForm(false)}
                  onApplied={handleApplied}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
