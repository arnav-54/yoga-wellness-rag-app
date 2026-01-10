require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/ask', (req, res) => {
  res.json({
    answer: 'Placeholder response',
    sources: [],
    isUnsafe: false
  });
});

app.post('/feedback', (req, res) => {
  res.json({ message: 'Feedback received' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});