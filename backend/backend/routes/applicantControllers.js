import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function getUserFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return json({ message: "Invalid or expired token" });
  }
}

router.get("/job/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
});

// Apply for a job
router.post("/job/apply/:jobId", async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { resumeLink } = req.body;
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({
      jobId,
      applicantId: user.id
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });

    // Create new application
    const application = new Application({
      jobId,
      applicantId: user.id,
      resumeLink,
      status: "Applied",
      history: [
        {
          status: "Applied",
          updatedBy: user.id,
          role: "bot",
          Comment: "Application submitted"
        }
      ]
    });

    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ message: "Error applying for job", error: err.message });
  }
});

// Get all applications
router.get("/application", async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const applications = await Application.find({ applicantId: user.id })
      .populate("jobId", "title location jobType")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving applications", error: err.message });
  }
});

export default router;