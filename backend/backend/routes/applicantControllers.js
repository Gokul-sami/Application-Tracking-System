import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

router.get("/job/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
});

export default router;