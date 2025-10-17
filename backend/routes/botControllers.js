import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const getNextStatus = (current) => {
  const order = ["Applied", "Under Review", "Interview", "Offered"];
  const index = order.indexOf(current);
  return order[index + 1] || "Offered";
};

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// bot mimic update applications
router.get("/update/application", async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const applications = await Application.find({
      applicantId: user.id,
      status: { $nin: ["Rejected", "Offered"] },
    }).populate("jobId");

    for (const app of applications) {
      const job = app.jobId;
      if (!job || job.jobType !== "Technical") continue;

      const lastHistory = app.history[app.history.length - 1];
      const lastUpdateTime = lastHistory.timestamp;

      if (lastUpdateTime < twoDaysAgo) {
        const decision = Math.random() < 0.5;

        if (decision) {
          const nextStatus = getNextStatus(app.status);
          app.status = nextStatus;
          app.history.push({
            status: nextStatus,
            updatedBy: "bot mimic",
            Comment: `Bot automatically progressed to ${nextStatus}`,
            timestamp: new Date(),
          });

          const log = new Log({
            applicationId: app.id,
            action: "Status Updated",
            role: "bot mimic",
            updatedBy: "68f111cf6d0bb8231ccc0028",
            comment: "Application status changed to " + nextStatus,
            timestamp: new Date(),
          });
          await log.save();
          
        } else {
          app.status = "Rejected";
          app.history.push({
            status: "Rejected",
            updatedBy: "bot mimic",
            Comment: "Bot automatically rejected after review",
            timestamp: new Date(),
          });

          const log = new Log({
            applicationId: app.id,
            action: "Status Updated",
            role: "bot mimic",
            updatedBy: "68f111cf6d0bb8231ccc0028",
            comment: "Application got Rejected",
            timestamp: new Date(),
          });
          await log.save();
        }

        await app.save();
      }
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      message: "Error running bot mimic",
      error: err.message,
    });
  }
});

export default router;
