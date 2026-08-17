import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function createEmbedding(text: string): Promise<number[]> {
  if (!openai) {
    // Generate deterministic 768-dim mock vector for local dev
    return Array.from({ length: 768 }, (_, i) => Math.sin(i + text.length) * 0.1);
  }

  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return res.data[0].embedding;
  } catch (err) {
    console.error("OpenAI Embedding API error:", err);
    return Array.from({ length: 768 }, (_, i) => Math.sin(i + text.length) * 0.1);
  }
}
