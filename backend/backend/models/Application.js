import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeLink: { type: String },
  status: { type: String, enum: ["Applied", "Under Review", "Interview", "Offered", "Rejected"], default: "Applied" },
  history: [
    {
        status: { type: String },
        updatedBy: { type: String, enum: ["admin", "bot mimic"] },
        Comment: { type: String },
        timestamp: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Application", applicationSchema);
