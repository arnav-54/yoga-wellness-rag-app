require('dotenv').config();
const { OpenAIEmbeddings } = require('@langchain/openai');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { Document } = require('@langchain/core/documents');
const fs = require('fs');
const path = require('path');

async function ingestKnowledge() {
    console.log('Starting knowledge ingestion...');

    const dataPath = path.join(__dirname, '../knowledge/yoga-data.json');
    const storePath = path.join(__dirname, '../vector-store');

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const yogaData = JSON.parse(rawData);

    console.log(`Loaded ${yogaData.length} knowledge entries`);

    const documents = [];

    for (const entry of yogaData) {
        const chunks = createChunks(entry);
        documents.push(...chunks);
    }

    console.log(`Created ${documents.length} document chunks`);

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'text-embedding-3-small',
    });

    console.log('Generating embeddings and building vector store...');

    const vectorStore = await FaissStore.fromDocuments(documents, embeddings);

    await vectorStore.save(storePath);

    console.log(`Vector store saved to ${storePath}`);
    console.log('Ingestion complete!');
}

function createChunks(entry) {
    const chunks = [];

    const mainContent = `${entry.title}

${entry.content}`;

    chunks.push(new Document({
        pageContent: mainContent,
        metadata: {
            id: entry.id,
            title: entry.title,
            category: entry.category,
            level: entry.level,
            type: 'main',
        },
    }));

    if (entry.benefits) {
        const benefitsContent = `${entry.title} - Benefits

${entry.benefits}`;

        chunks.push(new Document({
            pageContent: benefitsContent,
            metadata: {
                id: entry.id,
                title: entry.title,
                category: entry.category,
                level: entry.level,
                type: 'benefits',
            },
        }));
    }

    if (entry.contraindications) {
        const contraindicationsContent = `${entry.title} - Contraindications and Safety

${entry.contraindications}`;

        chunks.push(new Document({
            pageContent: contraindicationsContent,
            metadata: {
                id: entry.id,
                title: entry.title,
                category: entry.category,
                level: entry.level,
                type: 'safety',
            },
        }));
    }

    return chunks;
}

ingestKnowledge().catch(console.error);
