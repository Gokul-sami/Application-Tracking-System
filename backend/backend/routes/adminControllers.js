import express from "express";
import jwt from "jsonwebtoken";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Log from "../models/Log.js";

const router = express.Router();

// get admin from token
function getAdminFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// get all jobs
router.get("/job/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
});

// get applications count
router.get("/applications/count", async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    res.status(200).json({ totalApplications });
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications count", error: err.message });
  }
});

// create job
router.post("/job/create", async (req, res) => {
  try {
    const decoded = getAdminFromToken(req);

    // Verify admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Create job
    const { title, jobType, description, location, salary } = req.body;
    const newJob = new Job({ title, jobType, description, location, salary, createdBy: decoded.id });
    await newJob.save();

    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
});

// get job details
router.get("/job/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
});

// get applications for a job
router.get("/job/:jobId/applications", async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const applications = await Application.find({ jobId })
      .populate("applicantId", "name email")
      .populate("jobId", "title location jobType")
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      total: applications.length,
      applications
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving applications", error: err.message });
  }
});

// update status
router.put("/applications/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const decoded = getAdminFromToken(req);

    // Verify admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Validate allowed statuses
    const allowedStatuses = ["Applied", "Under Review", "Interview", "Offered", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find application
    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Update status
    application.status = status;

    // Add entry to history
    application.history.push({
      status,
      updatedBy: "admin",
      Comment: comment || `Status changed to ${status}`,
      timestamp: new Date(),
    });

    const log = new Log({
      applicationId: id,
      action: "Status Updated",
      role: "admin",
      updatedBy: decoded.id,
      comment: "Application status changed by "+ decoded.name +" as " + status,
      timestamp: new Date(),
    });
    
    await log.save();
    await application.save();

    res.status(200).json({
      message: `Application status updated to '${status}'`,
      application,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating application", error: err.message });
  }
});

export default router;
