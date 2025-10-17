import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  jobType: { type: String, required: true, enum: ["Technical", "Non-technical"] },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", jobSchema);
