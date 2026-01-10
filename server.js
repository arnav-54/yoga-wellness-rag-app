require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function detectUnsafeQuery(question) {
  const keywords = ['pregnancy', 'pregnant', 'surgery', 'hernia', 'glaucoma', 'blood pressure', 'heart'];
  return keywords.some(keyword => question.toLowerCase().includes(keyword));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/ask', (req, res) => {
  const { question } = req.body;
  const isUnsafe = detectUnsafeQuery(question || '');
  
  res.json({
    answer: 'Placeholder response',
    sources: [],
    isUnsafe
  });
});

app.post('/feedback', (req, res) => {
  res.json({ message: 'Feedback received' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});