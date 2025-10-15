import express from "express";
import jwt from "jsonwebtoken";
import Job from "../models/Job.js";

const router = express.Router();

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

export default router;
