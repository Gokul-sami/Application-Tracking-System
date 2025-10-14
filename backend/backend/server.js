import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch(err => {
    console.error("MongoDB Connection error:", err.message);
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
