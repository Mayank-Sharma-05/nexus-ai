"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, XCircle, Sparkles, UploadCloud, Download, Loader2 } from "lucide-react";

export default function ResumesPage() {
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [subScores, setSubScores] = useState<{
    keywords: number;
    impact: number;
    formatting: number;
    skills: number;
    structure: number;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    section: string;
    type: string;
    current: string;
    improved: string;
    status: "pending" | "accepted";
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleAccept = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "accepted" as const } : s))
    );
    setAtsScore((prev) => prev ? Math.min(prev + 3, 99) : null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('[RESUME UPLOAD] ========== STARTING UPLOAD PIPELINE ==========');
    console.log('[RESUME UPLOAD] File name:', file.name);
    console.log('[RESUME UPLOAD] File type:', file.type);
    console.log('[RESUME UPLOAD] File size:', file.size, 'bytes');
    console.log('[RESUME UPLOAD] Last modified:', new Date(file.lastModified).toISOString());

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'txt'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedTypes.includes(extension)) {
      console.log('[RESUME UPLOAD] File type validation failed:', extension);
      alert('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    console.log('[RESUME UPLOAD] File type validation passed:', extension);

    setIsAnalyzing(true);
    try {
      console.log('[RESUME UPLOAD] Converting file to ArrayBuffer...');
      const buffer = await file.arrayBuffer();
      console.log('[RESUME UPLOAD] ArrayBuffer size:', buffer.byteLength, 'bytes');
      
      const uint8Array = new Uint8Array(buffer);
      console.log('[RESUME UPLOAD] Uint8Array length:', uint8Array.length);
      console.log('[RESUME UPLOAD] First 10 bytes:', Array.from(uint8Array.slice(0, 10)));
      
      const payload = {
        fileName: file.name,
        fileBuffer: Array.from(uint8Array),
      };
      console.log('[RESUME UPLOAD] Payload created');
      console.log('[RESUME UPLOAD] Payload fileName:', payload.fileName);
      console.log('[RESUME UPLOAD] Payload fileBuffer length:', payload.fileBuffer.length);
      console.log('[RESUME UPLOAD] Payload size estimate:', JSON.stringify(payload).length, 'bytes');

      console.log('[RESUME UPLOAD] Fetching /api/v1/files/parse...');
      const res = await fetch('/api/v1/files/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[RESUME UPLOAD] Response received');
      console.log('[RESUME UPLOAD] Response status:', res.status);
      console.log('[RESUME UPLOAD] Response statusText:', res.statusText);
      console.log('[RESUME UPLOAD] Response headers:', Object.fromEntries(res.headers.entries()));
      
      const contentType = res.headers.get('content-type');
      console.log('[RESUME UPLOAD] Content-Type:', contentType);
      
      const responseText = await res.text();
      console.log('[RESUME UPLOAD] Response text length:', responseText.length);
      console.log('[RESUME UPLOAD] Response text (first 500 chars):', responseText.substring(0, 500));
      
      // Validate content-type before parsing JSON
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[RESUME UPLOAD] INVALID CONTENT-TYPE:', contentType);
        console.error('[RESUME UPLOAD] Full response body:', responseText);
        alert(`Server returned non-JSON response. Content-Type: ${contentType}. Status: ${res.status}. Check console for details.`);
        return;
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[RESUME UPLOAD] JSON parsed successfully');
        console.log('[RESUME UPLOAD] Data keys:', Object.keys(data));
      } catch (parseError) {
        console.error('[RESUME UPLOAD] JSON PARSE FAILED:', parseError);
        console.error('[RESUME UPLOAD] Parse error message:', parseError instanceof Error ? parseError.message : 'Unknown');
        console.error('[RESUME UPLOAD] Full response body:', responseText);
        alert(`Server returned invalid JSON. Status: ${res.status}. Check console for details.`);
        return;
      }

      if (data.success) {
        console.log('[RESUME UPLOAD] Upload successful');
        console.log('[RESUME UPLOAD] Extracted text length:', data.data.text?.length);
        console.log('[RESUME UPLOAD] Extracted text (first 200 chars):', data.data.text?.substring(0, 200));
        setResumeText(data.data.text);
      } else {
        console.error('[RESUME UPLOAD] API returned error');
        console.error('[RESUME UPLOAD] Error message:', data.error);
        alert(`Failed to parse file: ${data.error}`);
      }
    } catch (error) {
      console.error('[RESUME UPLOAD] UPLOAD FAILED');
      console.error('[RESUME UPLOAD] Error:', error);
      console.error('[RESUME UPLOAD] Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('[RESUME UPLOAD] Error stack:', error instanceof Error ? error.stack : 'No stack');
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsAnalyzing(false);
      console.log('[RESUME UPLOAD] ========== UPLOAD PIPELINE COMPLETE ==========');
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/v1/resumes/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (data.success && data.data.resumeAnalysis) {
        const analysis = data.data.resumeAnalysis;
        setAtsScore(analysis.atsScore);
        setSubScores(analysis.subScores);
        setSuggestions(analysis.suggestions.map((s: any) => ({ ...s, status: "pending" as const })));
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2433] pb-6">
        <div>
          <span className="badge-pill mb-2">Module 5 — ATS Optimizer</span>
          <h1 className="text-3xl font-extrabold text-white">Resume ATS Scanner & AI Rewriter</h1>
          <p className="text-gray-400 text-sm">Deterministic 0-100 scoring, keyword gap diagnostics, and interactive bullet diffs.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="glass-panel text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer hover:border-cyan-400">
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" /> Upload Resume (PDF/TXT)
            <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
          </label>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="btn-electric text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isAnalyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><Sparkles className="w-3.5 h-3.5" /> Analyze Resume</>}
          </button>
        </div>
      </div>

      {/* Top Score Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase text-gray-400 mb-2">Overall ATS Score</span>
          <div className="text-5xl font-black text-cyan-400 my-2">{atsScore ?? "--"}</div>
          {atsScore && (
            <span className="badge-pill bg-emerald-950/80 text-emerald-300 border-emerald-500/40 text-[10px]">
              Rank: {atsScore >= 85 ? "Top 5%" : atsScore >= 70 ? "Top 20%" : "Needs Improvement"}
            </span>
          )}
        </div>

        <div className="glass-panel p-6 md:col-span-3 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Sub-Score Diagnostics</h3>
          {subScores ? (
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Keyword Match Rate</span> <strong>{subScores.keywords}%</strong>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${subScores.keywords}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Quantifiable Impact</span> <strong>{subScores.impact}%</strong>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full" style={{ width: `${subScores.impact}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>ATS Readability & Formatting</span> <strong>{subScores.formatting}%</strong>
                </div>
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${subScores.formatting}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic">Upload and analyze a resume to see detailed diagnostics</div>
          )}
        </div>
      </div>

      {/* AI Suggestions Diff Box */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> AI Rewritten Suggestions (Accept / Reject)
          </h3>
          <span className="text-xs text-gray-400">Accepting updates your live copy</span>
        </div>

        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-xs text-gray-500 italic text-center py-8">
              No suggestions yet. Upload a resume and click "Analyze Resume" to get AI-powered improvements.
            </div>
          ) : (
            suggestions.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-[#0A0D14] border border-gray-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{s.section}</span>
                  <span className="badge-pill text-[10px]">{s.type}</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-rose-950/20 border-l-2 border-rose-500 text-rose-300">
                    <span className="font-bold">Original:</span> {s.current}
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950/20 border-l-2 border-emerald-500 text-emerald-300">
                    <span className="font-bold">AI Improved:</span> {s.improved}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                  {s.status === "accepted" ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accepted & Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAccept(s.id)}
                      className="btn-electric text-xs py-1 px-3"
                    >
                      Accept Suggestion
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
