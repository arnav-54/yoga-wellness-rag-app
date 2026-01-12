# RAG Implementation Documentation

## Overview

This project implements Retrieval-Augmented Generation (RAG) to provide accurate, context-based answers to yoga and wellness questions.

## Architecture

### Components

1. **Knowledge Base** (`knowledge/yoga-data.json`)
   - 32 structured entries covering poses, breathing, concepts, and safety
   - Each entry includes: title, content, benefits, contraindications, metadata

2. **Document Processing** (`scripts/ingest.js`)
   - Chunks each entry into multiple documents (main content, benefits, contraindications)
   - Creates 96 total document chunks from 32 entries
   - Adds metadata for filtering and source attribution

3. **Embeddings**
   - Model: Gemini `text-embedding-004`
   - Generates semantic vector representations of text chunks
   - Enables similarity-based retrieval

4. **Vector Store** (`vector-store/`)
   - Technology: FAISS (Facebook AI Similarity Search)
   - Stores embeddings and enables fast k-nearest-neighbor search
   - Persisted to disk for quick server startup

5. **RAG Service** (`services/ragService.js`)
   - Singleton service managing embeddings, retrieval, and generation
   - Implements vector similarity search
   - Constructs prompts with retrieved context
   - Generates responses using Gemini Flash Latest

## RAG Flow

```
User Question
    ↓
Safety Detection (existing)
    ↓
Embed Question → Search Vector Store → Retrieve Top 4 Matches
    ↓
Extract Context + Source Metadata
    ↓
Construct Prompt with Context + Safety Instructions
    ↓
Generate Answer (Gemini 1.5 Flash)
    ↓
Return {answer, sources, isUnsafe}
    ↓
Frontend Display
```

## Retrieval Strategy

- **Top K**: 4 most relevant chunks per query
- **Similarity**: Cosine similarity in embedding space
- **Metadata**: Preserves source titles for attribution

## Generation Strategy

### Prompt Structure

```
System Role: Knowledgeable yoga instructor
Constraints:
- Answer ONLY from provided context
- No medical advice or diagnoses
- State when information is unavailable
- For unsafe queries: recommend professional consultation

Context: [Retrieved chunks]
Question: [User question]
```

### Safety Integration

When `isUnsafe=true`:
- Adds explicit constraint against medical advice
- Suggests gentle alternatives if available in context
- Recommends consulting qualified professionals
- Maintains informational tone without diagnoses

### Temperature & Tokens

- Temperature: 0.3 (focused, consistent responses)
- Max Tokens: 500 (concise answers)

## Knowledge Base Schema

```json
{
  "id": "unique_identifier",
  "title": "Display name",
  "category": "pose|pranayama|general|safety",
  "level": "beginner|intermediate|advanced",
  "content": "Main description",
  "benefits": "Health and practice benefits",
  "contraindications": "When to avoid or modify"
}
```

## Chunking Strategy

Each entry → 3 chunks:
1. **Main**: Title + content (primary information)
2. **Benefits**: Title + benefits (positive outcomes)
3. **Safety**: Title + contraindications (risk mitigation)

This ensures:
- Focused retrieval per query intent
- Better matching for benefit vs. safety questions
- Efficient use of context window

## Vector Store Persistence

- Format: FAISS binary index + document store
- Location: `vector-store/`
- Rebuild: Run `npm run ingest` after knowledge base updates
- Gitignored: Not committed (regenerate per environment)

## Error Handling

1. **Missing Vector Store**: Server fails to start with clear error
2. **Gemini API Errors**: Graceful fallback message to user
3. **Empty Context**: Returns "no information available" message
4. **Network Issues**: 500 response with retry-friendly message

## Performance Considerations

- **Initialization**: Vector store loads on server start (~1-2 seconds)
- **Query Latency**: 
  - Vector search: ~50ms
  - Gemini API call: ~1-3 seconds
  - Total: ~1.5-3.5 seconds per query
- **Concurrent Requests**: Handle via async/await, no blocking

## Extending the System

### Adding Knowledge

1. Add entries to `knowledge/yoga-data.json`
2. Run `npm run ingest`
3. Restart server

### Changing Retrieval

Edit `ragService.js`:
- Modify `topK` in `retrieveContext()`
- Add filtering by metadata (category, level)
- Adjust similarity thresholds

### Changing Generation

Edit `ragService.js`:
- Update prompt template in `generateAnswer()`
- Change model (update `modelName` in constructor)
- Adjust temperature/max tokens

### Alternative Vector Stores

Replace FAISS with Chroma, Pinecone, or Qdrant:
- Update imports in `ragService.js` and `ingest.js`
- Modify initialization and search methods
- Update `.gitignore` if needed

## Security

- API key stored in `.env` (gitignored)
- No user data persistence
- Input validation on `/ask` endpoint
- Rate limiting recommended for production (not implemented)

## Testing Recommendations

1. **Knowledge Coverage**: Query variety of pose types, breathing, safety
2. **Safety Detection**: Test with contraindicated conditions
3. **Edge Cases**: Empty questions, very long questions, non-English
4. **Source Attribution**: Verify returned sources match content
5. **Hallucination Check**: Ask questions outside knowledge base

## Limitations

- Knowledge limited to 32 entries (expandable)
- English language only
- No conversation history/memory
- No user-specific personalization
- Gemini API dependency (cost and latency)

## Future Enhancements

- Add conversation context for follow-up questions
- Implement caching for common queries
- Add multimedia support (images, videos)
- User feedback loop to improve responses
- Multi-language support
- Offline mode with local models
