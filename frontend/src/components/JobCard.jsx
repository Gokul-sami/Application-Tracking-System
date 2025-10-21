import React from "react";
import "./JobCard.css";

const JobCard = ({ job, onApplyClick }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong>Type:</strong> {job.jobType}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary ? `₹${job.salary}` : "N/A"}</p>
      <button className="cursor-target" onClick={() => onApplyClick(job)}>Apply</button>
    </div>
  );
};

export default JobCard;
