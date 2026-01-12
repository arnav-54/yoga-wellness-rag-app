const { OpenAIEmbeddings } = require('@langchain/openai');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { OpenAI } = require('@langchain/openai');
const path = require('path');

class RAGService {
  constructor() {
    this.vectorStore = null;
    this.embeddings = null;
    this.llm = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'text-embedding-3-small',
      });

      this.llm = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-3.5-turbo-instruct',
        temperature: 0.3,
        maxTokens: 500,
      });

      const storePath = path.join(__dirname, '../vector-store');
      this.vectorStore = await FaissStore.load(storePath, this.embeddings);
      
      this.initialized = true;
      console.log('RAG service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RAG service:', error.message);
      throw error;
    }
  }

  async retrieveContext(question, topK = 4) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const results = await this.vectorStore.similaritySearchWithScore(question, topK);
      
      const context = results.map(([doc]) => doc.pageContent).join('\n\n');
      const sources = results.map(([doc]) => ({
        title: doc.metadata.title,
        id: doc.metadata.id,
        category: doc.metadata.category,
      }));

      return { context, sources };
    } catch (error) {
      console.error('Error retrieving context:', error.message);
      throw error;
    }
  }

  async generateAnswer(question, context, isUnsafe = false) {
    if (!this.initialized) {
      await this.initialize();
    }

    const safetyNote = isUnsafe 
      ? '\n\nIMPORTANT: This question involves medical contraindications. Do not provide medical advice. Only suggest gentle, safe practices if available in context, and recommend consulting a qualified yoga instructor or healthcare professional.'
      : '';

    const prompt = `You are a knowledgeable yoga instructor. Answer the question based ONLY on the provided context. If the answer is not in the context, say "I don't have specific information about that in my knowledge base."

Do not make up information. Do not provide medical diagnoses or treatment advice.${safetyNote}

Context:
${context}

Question: ${question}

Answer:`;

    try {
      const response = await this.llm.call(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error generating answer:', error.message);
      throw error;
    }
  }

  async answerQuestion(question, isUnsafe = false) {
    try {
      const { context, sources } = await this.retrieveContext(question);
      
      if (!context) {
        return {
          answer: "I don't have specific information about that in my knowledge base. Please ask about yoga poses, breathing techniques, or general yoga practices.",
          sources: [],
        };
      }

      const answer = await this.generateAnswer(question, context, isUnsafe);
      
      return {
        answer,
        sources: sources.map(s => s.title),
      };
    } catch (error) {
      console.error('Error in answerQuestion:', error.message);
      throw error;
    }
  }
}

module.exports = new RAGService();
