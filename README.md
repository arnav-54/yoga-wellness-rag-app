# YOGA AI PROJECT

A Node.js backend with Express and React frontend for Q&A functionality.

## Backend
- Express server with CORS and safety detection
- Health, ask, and feedback endpoints
- Medical keyword filtering

## Frontend  
- React with Vite
- Question submission form
- Safety warnings for medical content
- Error handling and loading states

## Setup

### Backend
```bash
npm install
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
- POST /ask - Submit questions
- POST /feedback - Submit feedback