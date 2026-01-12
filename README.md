# Yoga Wellness AI – RAG Assistant

An intelligent **Yoga & Wellness assistant** built using **Retrieval-Augmented Generation (RAG)**.  
This app uses the latest **Gemini AI models** to provide accurate, safe, and context-aware answers based on a curated yoga knowledge base.

---

## ✨ Key Features

- **Knowledge-Powered**  
  Uses RAG to retrieve information from a dedicated yoga knowledge base via **FAISS Vector Store**.

- **Gemini Integration**  
  Powered by **gemini-flash-latest** for lightning-fast and accurate responses.

- **Persistence**  
  All user interactions (queries, answers, sources) are stored in **MongoDB Atlas** using **Prisma ORM**.

- **Feedback Loop**  
  Integrated feedback mechanism allowing users to rate AI responses.

- ⚡ **Modern UI**  
  Sleek React frontend featuring:
  - Responsive layout  
  - Loading indicators (spinners)  
  - Smooth fade-in animations for AI answers  
  - Safety flags for sensitive medical queries  

- 🧪 **Testing Suite**  
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

---

```

