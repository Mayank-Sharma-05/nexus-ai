import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { chunkDocument } from "@/lib/ai/ragEngine";
import { createEmbedding } from "@/lib/ai/openai";

export async function POST(req: NextRequest) {
  console.log('[RAG UPLOAD] Request received');
  
  try {
    console.log('[RAG UPLOAD] Authenticating user...');
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log('[RAG UPLOAD] Unauthorized');
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.log('[RAG UPLOAD] User authenticated:', user.id);

    const body = await req.json();
    console.log('[RAG UPLOAD] Request body keys:', Object.keys(body));
    console.log('[RAG UPLOAD] fileName:', body.fileName);
    console.log('[RAG UPLOAD] fileType:', body.fileType);
    console.log('[RAG UPLOAD] textContent length:', body.textContent?.length);
    
    const { fileName, fileType = "pdf", textContent = "" } = body;
    
    if (!fileName || !textContent) {
      console.log('[RAG UPLOAD] Missing required fields');
      return NextResponse.json({ success: false, error: "File name and content required" }, { status: 400 });
    }

    console.log('[RAG UPLOAD] Chunking document...');
    // 1. Structure-aware chunking
    const chunks = chunkDocument(textContent, 500);
    console.log('[RAG UPLOAD] Chunks created:', chunks.length);

    console.log('[RAG UPLOAD] Generating embeddings...');
    // 2. Generate embeddings for each chunk
    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunk, idx) => {
        console.log(`[RAG UPLOAD] Generating embedding for chunk ${idx + 1}/${chunks.length}`);
        const embedding = await createEmbedding(chunk.content);
        return {
          ...chunk,
          embedding: embedding,
        };
      })
    );
    console.log('[RAG UPLOAD] Embeddings generated');

    console.log('[RAG UPLOAD] Creating document in database...');
    // 3. Create document & chunks with embeddings in database
    const document = await prisma.document.create({
      data: {
        userId: user.id,
        fileName,
        fileType,
        fileSizeBytes: textContent.length,
        status: "ready",
        chunks: {
          create: chunksWithEmbeddings.map((c) => ({
            chunkIndex: c.index,
            section: c.section,
            content: c.content,
            embedding: {
              create: {
                vector: c.embedding,
              },
            },
          })),
        },
      },
      include: {
        chunks: true,
      },
    });
    console.log('[RAG UPLOAD] Document created:', document.id);

    console.log('[RAG UPLOAD] Returning success response');
    return NextResponse.json({ success: true, data: document });
  } catch (error: any) {
    console.error('[RAG UPLOAD] Error:', error);
    console.error('[RAG UPLOAD] Error message:', error.message);
    console.error('[RAG UPLOAD] Error stack:', error.stack);
    
    // Always return JSON, never HTML
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
