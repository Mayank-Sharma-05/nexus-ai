/**
 * NEXUS AI — Production RAG Engine (Chunking, Embeddings, & pgvector Search)
 */

import { createEmbedding } from "./openai";

export interface ChunkItem {
  index: number;
  section: string;
  content: string;
}

export function chunkDocument(text: string, chunkSize: number = 500): ChunkItem[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: ChunkItem[] = [];
  let currentChunk = "";
  let chunkIdx = 1;

  for (const para of paragraphs) {
    if ((currentChunk + "\n" + para).length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        index: chunkIdx++,
        section: `Section ${chunkIdx}`,
        content: currentChunk.trim(),
      });
      // 10% overlap from end of previous chunk
      currentChunk = currentChunk.slice(-Math.floor(chunkSize * 0.1)) + "\n" + para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      index: chunkIdx,
      section: `Section ${chunkIdx}`,
      content: currentChunk.trim(),
    });
  }

  return chunks;
}

export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
