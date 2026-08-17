import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { generateGeminiResponse, GeminiChatMessage } from "@/lib/ai/gemini";
import { createEmbedding } from "@/lib/ai/openai";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    // Check if user has any indexed documents
    const documentCount = await prisma.document.count({
      where: { userId: user.id, status: "ready" },
    });

    if (documentCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "No documents indexed. Please upload documents first." 
      }, { status: 400 });
    }

    // Generate embedding for the query
    const queryEmbedding = await createEmbedding(query);

    // Use pgvector cosine similarity to find the most similar chunks
    const similarChunks = await prisma.$queryRaw`
      SELECT 
        dc.chunk_index,
        dc.section,
        dc.content,
        d.file_name as "docName",
        e.vector <=> ${queryEmbedding}::vector(768) as distance
      FROM document_chunk dc
      JOIN document d ON d.id = dc.document_id
      JOIN embedding e ON e.chunk_id = dc.id
      WHERE d.user_id = ${user.id} AND d.status = 'ready'
      ORDER BY e.vector <=> ${queryEmbedding}::vector(768)
      LIMIT 5
    `;

    if (!similarChunks || (similarChunks as any[]).length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          answer: "I couldn't find relevant information in your indexed documents to answer this question. Try rephrasing your query or uploading more relevant documents.",
          sources: [],
        },
      });
    }

    const topMatches = (similarChunks as any[]).slice(0, 3).map((m: any) => ({
      docName: m.docName,
      section: m.section || `Section ${m.chunk_index}`,
      chunkIndex: m.chunk_index,
      content: m.content,
      score: ((1 - parseFloat(m.distance)) * 100).toFixed(1) + "%",
    }));

    // Use Gemini to generate a grounded response
    let answer: string;
    try {
      const contextText = topMatches.map((m, i) => 
        `[Source ${i + 1}: ${m.docName} - ${m.section}]\n${m.content}`
      ).join("\n\n");

      const prompt: GeminiChatMessage[] = [
        {
          role: "user",
          content: `You are a helpful AI assistant that answers questions based ONLY on the provided document context. If the answer is not in the context, say so explicitly.

Context from indexed documents:
${contextText}

Question: ${query}

Provide a clear, accurate answer based on the context. Cite which document(s) you used in your answer. Do not make up information.`
        }
      ];

      const response = await generateGeminiResponse(prompt);
      answer = response.text;
    } catch (error) {
      console.error("Gemini RAG response failed, using fallback:", error);
      // Fallback to simple context-based answer
      const topMatch = topMatches[0];
      answer = `Based on your indexed document **${topMatch.docName}** (${topMatch.section}):\n\n"${topMatch.content}"`;
    }

    return NextResponse.json({
      success: true,
      data: {
        answer,
        sources: topMatches,
      },
    });
  } catch (error: any) {
    console.error("RAG query error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
