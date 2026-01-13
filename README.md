# 🧘 Yoga Wellness AI - RAG Assistant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

An intelligent **Yoga & Wellness assistant** built using **Retrieval-Augmented Generation (RAG)**.  
This app uses the latest **Gemini AI models** to provide accurate, safe, and context-aware answers based on a curated yoga knowledge base.

---

## ✨ Key Features

- **🧠 Knowledge-Powered**  
  Uses RAG to retrieve information from a dedicated yoga knowledge base via a FAISS Vector Store.

- **🤖 Gemini Integration**  
  Powered by `gemini-flash-latest` for lightning-fast and accurate responses.

- **💾 Persistence**  
  All user interactions (queries, answers, sources) are stored in **MongoDB Atlas** using the **Prisma ORM**.

- **👍 Feedback Loop**  
  Integrated feedback mechanism allowing users to rate AI responses.

- **⚡ Modern UI**  
  Sleek React frontend featuring:
  - Responsive layout  
  - Loading indicators (spinners)  
  - Smooth fade-in animations for AI answers  
  - Safety flags for sensitive medical queries  

- **🧪 Testing Suite**  
  Built-in end-to-end automated testing to verify API and database health.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), CSS3  
- **Backend:** Node.js, Express  
- **AI / LLM:** Google Gemini AI (`gemini-flash-latest`)  
- **Embeddings:** `text-embedding-004`  
- **Database:** MongoDB Atlas  
- **ORM:** Prisma 5  
- **Vector Store:** LangChain FAISS  
- **Testing:** Node.js Custom Test Suite  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API Key (Gemini)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arnav-54/yoga-wellness-rag-app.git
   cd yoga-wellness-rag-app
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npx prisma generate
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Ingest Knowledge Base**:
   ```bash
   cd ../backend
   node scripts/ingest.js
   ```

---

## 📂 Project Structure
```text
├── backend/
│   ├── prisma/             # Database Schema
│   ├── scripts/            # Ingestion & Utility scripts
│   ├── knowledge/          # Raw Yoga data (JSON/MD)
│   ├── vector-store/       # Local vector database (FAISS)
│   ├── test-suite.js       # E2E test runner
│   └── server.js           # API Server
├── frontend/
│   ├── src/                # React App components
│   └── App.jsx             # Main Application Logic
└── README.md
```

---

## 🧪 System Testing
To verify the full stack (API + AI + DB), run the internal test suite:
```bash
cd backend
node test-suite.js
```
This will generate a `TEST_REPORT.md` in the root directory.

---

## 🌍 Deployment

The application is structured for easy deployment on platforms like Render, Railway, or Heroku.

### Automated Deployment (Recommended)
1. Set the **Build Command** to: `npm run build`
2. Set the **Start Command** to: `npm start`
3. Configure the following **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google AI Studio key
   - `DATABASE_URL`: Your MongoDB connection string
   - `NODE_ENV`: `production`

### Manual Production Build
1. Build the frontend:
   ```bash
   cd frontend && npm install && npm run build
   ```
2. Setup the backend:
   ```bash
   cd ../backend && npm install
   npx prisma generate
   ```
3. Start the combined production server:
   ```bash
   NODE_ENV=production npm start
   ```

---

## 📜 License
This project is licensed under the MIT License.
