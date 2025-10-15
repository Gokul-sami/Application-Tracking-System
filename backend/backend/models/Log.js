import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  action: { type: String, required: true },
  role: { type: String, enum: ["admin", "bot"], required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  comment: { type: String, required: true },
});

export default mongoose.model("Log", logSchema);
