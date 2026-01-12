# YOGA AI PROJECT

A Node.js backend with Express and React frontend for yoga Q&A functionality with RAG-based responses.

## Backend
- Express server with CORS and safety detection
- Health, ask, and feedback endpoints
- Medical keyword filtering
- RAG system with Gemini AI embeddings and FAISS vector store
- Yoga knowledge base with 30+ entries

## Frontend  
- React with Vite
- Question submission form
- Safety warnings for medical content
- Error handling and loading states

## Setup

### Backend

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to `.env`

3. Build vector store (first time only):
```bash
node scripts/ingest.js
```

4. Start server:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- GET /health - Server health check
- POST /ask - Submit questions (returns AI-generated answers with sources)
- POST /feedback - Submit feedback