import express from "express";
import jwt from "jsonwebtoken";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { decompressSync } from "three/examples/jsm/libs/fflate.module.js";

const router = express.Router();

// create job
router.post("/job/create", async (req, res) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

// get applications for a job
router.get("/job/:jobId/applications", async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(jobId);

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
    console.log(req.params);
    const { id } = req.params;
    const { status, comment } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
      updatedBy: decoded.id,
      role: decoded.role,
      Comment: comment || `Status changed to ${status}`,
    });

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
