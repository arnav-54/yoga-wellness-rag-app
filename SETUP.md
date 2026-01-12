# Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm
- OpenAI API account

## Step-by-Step Setup

### 1. Install Dependencies

Navigate to the project directory and install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

### 2. Configure OpenAI API Key

Get an API key from OpenAI:
1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Create a new API key
4. Copy the key

Add the key to your environment:
1. The `.env` file already exists in the root directory
2. Open `.env` and replace `your_openai_api_key_here` with your actual API key:
   ```
   PORT=3001
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### 3. Build Vector Store

Run the ingestion script to process the yoga knowledge base and create embeddings:

```bash
npm run ingest
```

This will:
- Load 30+ yoga knowledge entries from `knowledge/yoga-data.json`
- Create document chunks for efficient retrieval
- Generate embeddings using OpenAI
- Build and save a FAISS vector store to `vector-store/`

Expected output:
```
Starting knowledge ingestion...
Loaded 32 knowledge entries
Created 96 document chunks
Generating embeddings and building vector store...
Vector store saved to /path/to/vector-store
Ingestion complete!
```

This step only needs to be run once, or when you update the knowledge base.

### 4. Start the Backend

```bash
npm run dev
```

The server will start on port 3001. You should see:
```
RAG service initialized successfully
Server running on port 3001
```

### 5. Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will typically start on port 5173.

### 6. Test the Application

1. Open your browser to the frontend URL (usually http://localhost:5173)
2. Ask a yoga-related question, for example:
   - "What is Mountain Pose?"
   - "How do I do Downward Dog?"
   - "What are the benefits of breathing exercises?"
   - "I have high blood pressure, what poses should I avoid?"
3. The app will retrieve relevant information and generate an answer with sources

## Troubleshooting

### Vector Store Not Found
If you see "Failed to initialize RAG service", make sure you ran `npm run ingest` first.

### OpenAI API Errors
- Verify your API key is correct in `.env`
- Check you have credits in your OpenAI account
- Ensure there are no extra spaces or quotes around the API key

### Port Already in Use
If port 3001 is busy, change the `PORT` value in `.env`

### Module Not Found Errors
Run `npm install --legacy-peer-deps` to resolve dependency conflicts

## Project Structure

```
yoga-wellness-rag-app/
├── knowledge/
│   └── yoga-data.json          # Yoga knowledge base
├── scripts/
│   └── ingest.js               # Vector store builder
├── services/
│   └── ragService.js           # RAG logic and AI integration
├── frontend/                   # React frontend
├── vector-store/               # Generated FAISS index (gitignored)
├── server.js                   # Express backend
├── .env                        # Environment variables (gitignored)
└── .env.example                # Environment template
```

## Knowledge Base

The knowledge base includes:
- 20 yoga poses (beginner to advanced)
- 4 breathing techniques
- 8 general concepts and safety guidelines
- Benefits and contraindications for each

To add more content, edit `knowledge/yoga-data.json` and re-run `npm run ingest`.
