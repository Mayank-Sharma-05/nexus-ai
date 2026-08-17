"use client";

import React, { useState, useEffect } from "react";
import { Brain, FileText, UploadCloud, Search, CheckCircle2, ArrowRight, Loader2, X } from "lucide-react";

interface Document {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  status: string;
  chunks: { chunkIndex: number }[];
}

export default function RAGPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; sources?: any[] }>>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/v1/rag/documents");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDocuments(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedTypes.includes(extension)) {
      alert('Please upload a PDF, DOCX, TXT, or image file.');
      return;
    }

    setIsUploading(true);
    try {
      console.log('[RAG FRONTEND] Starting file upload:', file.name);
      const buffer = await file.arrayBuffer();
      console.log('[RAG FRONTEND] Buffer size:', buffer.length);
      
      // Parse file to extract text
      console.log('[RAG FRONTEND] Calling /api/v1/files/parse');
      const parseRes = await fetch('/api/v1/files/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileBuffer: Array.from(new Uint8Array(buffer)),
        }),
      });

      console.log('[RAG FRONTEND] Parse response status:', parseRes.status);
      const parseResponseText = await parseRes.text();
      console.log('[RAG FRONTEND] Parse response (first 200 chars):', parseResponseText.substring(0, 200));
      
      let parseData;
      try {
        parseData = JSON.parse(parseResponseText);
      } catch (parseError) {
        console.error('[RAG FRONTEND] Failed to parse JSON from file parse:', parseError);
        throw new Error(`File parse returned non-JSON. Status: ${parseRes.status}`);
      }

      if (!parseData.success) {
        throw new Error(parseData.error || 'Failed to parse file');
      }
      console.log('[RAG FRONTEND] File parsed successfully, text length:', parseData.data.text?.length);

      // Upload to RAG system
      console.log('[RAG FRONTEND] Calling /api/v1/rag/upload');
      const res = await fetch("/api/v1/rag/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: extension,
          textContent: parseData.data.text,
        }),
      });

      console.log('[RAG FRONTEND] RAG upload response status:', res.status);
      const ragResponseText = await res.text();
      console.log('[RAG FRONTEND] RAG upload response (first 200 chars):', ragResponseText.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(ragResponseText);
      } catch (parseError) {
        console.error('[RAG FRONTEND] Failed to parse JSON from RAG upload:', parseError);
        throw new Error(`RAG upload returned non-JSON. Status: ${res.status}`);
      }

      if (data.success) {
        console.log('[RAG FRONTEND] RAG upload successful');
        setDocuments(prev => [...prev, data.data]);
      } else {
        throw new Error(data.error || 'Failed to upload to RAG system');
      }
    } catch (error) {
      console.error("[RAG FRONTEND] Upload failed:", error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    const userQ = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: "user", content: userQ }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQ }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.data.answer,
          sources: data.data.sources 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `Error: ${data.error}` 
        }]);
      }
    } catch (error) {
      console.error("Query failed:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Failed to process your query. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-100px)] overflow-hidden">
      {/* Document Sidebar */}
      <aside className="w-80 bg-[#0C0F17] border-r border-[#1E2433] flex flex-col p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Indexed Docs ({documents.length})</span>
          <label className="btn-electric text-xs py-1.5 px-3 cursor-pointer disabled:opacity-50">
            {isUploading ? <><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</> : <><UploadCloud className="w-3 h-3" /> Upload</>}
            <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1">
          {documents.length === 0 ? (
            <div className="text-xs text-gray-500 italic text-center py-8">
              No documents uploaded yet. Upload PDF, DOCX, or TXT files to get started.
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-400 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{doc.fileName}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>{(doc.fileSizeBytes / 1024).toFixed(1)} KB</span>
                  <span className="text-emerald-400 font-bold">READY ({doc.chunks.length} chunks)</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main RAG Workspace */}
      <main className="flex-1 flex flex-col bg-[#08090C] overflow-hidden">
        <div className="border-b border-[#1E2433] px-6 py-3 flex items-center justify-between bg-[#0B0E14]">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Grounded Knowledge Base Q&A</span>
          </div>
          <span className="badge-pill text-[10px]">pgvector HNSW (768-dim)</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:px-24 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-xs italic py-12">
              Upload documents and ask questions to get started with RAG-powered Q&A.
            </div>
          ) : (
            messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    m.role === "user" ? "bg-[#182236] text-white" : "bg-[#131722] border border-[#1E2433] text-gray-200"
                  }`}
                >
                  <div>{m.content}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Sources: {m.sources.map((s: any) => `${s.docName} [${s.section}]`).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="bg-[#131722] border border-[#1E2433] rounded-2xl p-4 text-xs text-gray-400 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Searching your documents...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:px-24 border-t border-[#1E2433] bg-[#0B0E14]">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuery();
              }}
              placeholder="Ask questions across your uploaded documents..."
              className="flex-1 bg-[#131722] border border-gray-800 text-white text-xs px-4 py-2.5 rounded-xl outline-none focus:border-cyan-400"
              disabled={isLoading}
            />
            <button onClick={handleQuery} disabled={isLoading || !query.trim()} className="btn-electric text-xs py-2 px-5 disabled:opacity-50">
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
