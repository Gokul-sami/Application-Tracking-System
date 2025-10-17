import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard";
import ApplicationForm from "../../components/ApplicationForm";
import "../styles/applicantHome.css";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Get all jobs
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="applicant-home">
      <header className="home-header">
        <div className="header-top">
          <h1>Welcome Back!</h1>
          <button className="my-applications-btn" onClick={() => navigate("/applicant/my-applications")}>
            My Applications
          </button>
        </div>
        <p>Explore jobs and apply to the ones that fit you</p>
      </header>

      {/* Jobs Section */}
      <section className="jobs-section">
        <h2>Available Jobs</h2>
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <p>No jobs available currently.</p>
          ) : (
            jobs.map((job) => (
              <JobCard key={job._id} job={job} onApplyClick={handleApplyClick} />
            ))
          )}
        </div>
      </section>

      {/* Application Form */}
      {showForm && selectedJob && (
        <ApplicationForm
          job={selectedJob}
          onClose={() => setShowForm(false)}
          onApplied={handleApplied}
        />
      )}
    </div>
  );
};

export default Home;
