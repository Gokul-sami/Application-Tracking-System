import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  action: { type: String, required: true },
  role: { type: String, enum: ["applicant", "admin", "bot mimic"], required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", logSchema);
