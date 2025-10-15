import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authControllers from "./routes/authControllers.js";
import applicantControllers from "./routes/applicantControllers.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGODB_URI;

// connnect to db
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch(err => {
    console.error("MongoDB Connection error:", err.message);
});

// Test Route
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// signup and login routes
app.use("/api/auth", authControllers);

// applicant routes
app.use("/api/applicant", applicantControllers);

// admin routes
app.use("/api/admin", adminControllers);

// bot mimic routes
app.use("/api/bot", botControllers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);
