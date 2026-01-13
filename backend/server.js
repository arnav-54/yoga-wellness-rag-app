require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const ragService = require('./services/ragService');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const prisma = new PrismaClient();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

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


    let interactionId = null;
    try {
      const interaction = await prisma.interaction.create({
        data: {
          userQuery: question,
          finalAnswer: answer,
          retrievedChunks: sources,
          isUnsafe: isUnsafe,
        },
      });
      interactionId = interaction.id;
      console.log(`Stored interaction ${interactionId} in DB`);
    } catch (dbError) {
      console.error('Failed to save interaction to DB:', dbError);
    }

    res.json({
      interactionId,
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

app.post('/feedback', async (req, res) => {
  try {
    const { interactionId, feedback } = req.body;

    if (!interactionId) {
      return res.status(400).json({ error: 'Interaction ID is required' });
    }

    if (!['positive', 'negative'].includes(feedback)) {
      return res.status(400).json({ error: 'Invalid feedback value' });
    }

    await prisma.interaction.update({
      where: { id: interactionId },
      data: { feedback },
    });

    res.json({ message: 'Feedback received' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// For any other request, send back index.html in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

async function startServer() {
  try {
    await ragService.initialize();

    await prisma.$connect();
    console.log('Connected to MongoDB via Prisma');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();