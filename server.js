require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ragService = require('./services/ragService');

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

app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const isUnsafe = detectUnsafeQuery(question);

    const { answer, sources } = await ragService.answerQuestion(question, isUnsafe);

    res.json({
      answer,
      sources,
      isUnsafe
    });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({
      error: 'Failed to process question',
      answer: 'I apologize, but I encountered an error. Please try again.',
      sources: [],
      isUnsafe: false
    });
  }
});

app.post('/feedback', (req, res) => {
  res.json({ message: 'Feedback received' });
});

async function startServer() {
  try {
    await ragService.initialize();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();