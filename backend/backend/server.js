import express from 'express';
const app = express();

app.get('/api/message', () => {
  res.json('Hello from Express!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
