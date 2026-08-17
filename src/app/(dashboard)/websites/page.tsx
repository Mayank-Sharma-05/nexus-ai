"use client";

import React, { useState } from "react";
import { Zap, Monitor, Tablet, Smartphone, Download, RotateCw, FileCode, CheckCircle2, Bookmark } from "lucide-react";

export default function WebsitesPage() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [prompt, setPrompt] = useState("Create a modern dark-mode SaaS landing page for an AI observability platform");
  const [isGenerating, setIsGenerating] = useState(false);

  const saasHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background: #08090D; color: #F3F4F6; }</style>
</head>
<body class="selection:bg-cyan-500 selection:text-black">
  <nav class="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-lg">⚡</div>
      <span class="text-xl font-bold">NexusFlow</span>
    </div>
    <button class="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-5 py-2 rounded-lg text-sm">Get Started Free</button>
  </nav>
  <header class="py-20 px-6 max-w-4xl mx-auto text-center">
    <div class="inline-block px-4 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold uppercase mb-6">
      ✨ NexusFlow 2.0 Telemetry
    </div>
    <h1 class="text-6xl font-extrabold mb-6">Observe & Optimize <br><span class="text-cyan-400">Autonomous AI Workflows</span></h1>
    <p class="text-gray-400 text-lg mb-8">Sub-millisecond token caching & real-time LLM hallucination tracing.</p>
    <button class="bg-cyan-400 text-black font-bold px-8 py-3.5 rounded-xl shadow-lg">Start 14-Day Trial</button>
  </header>
</body>
</html>`;

  const [currentHtml, setCurrentHtml] = useState(saasHtml);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-100px)] overflow-hidden">
      {/* Top Controls Bar */}
      <div className="border-b border-[#1E2433] bg-[#0B0E15] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="badge-pill"><Zap className="w-3.5 h-3.5" /> Website Studio</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentHtml(saasHtml)}
              className="px-2.5 py-1 text-xs rounded bg-gray-900 border border-gray-800 hover:border-cyan-400 text-gray-300 font-medium"
            >
              SaaS Platform
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="glass-panel text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-cyan-400">
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" /> Save to Workspace
          </button>
          <button
            onClick={() => {
              const blob = new Blob([currentHtml], { type: "text/html" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "nexus-generated-website.html";
              a.click();
            }}
            className="btn-electric text-xs py-1.5 px-4 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Source
          </button>
        </div>
      </div>

      {/* Prompt Input Bar */}
      <div className="bg-[#08090C] border-b border-[#1E2433] p-4">
        <div className="max-w-5xl mx-auto flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the website you want to generate (e.g., 'Create a dark-mode Web3 DeFi landing page')..."
            className="flex-1 bg-[#131722] border border-gray-800 text-white text-xs px-4 py-2.5 rounded-xl outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-electric text-xs py-2 px-6 flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" /> {isGenerating ? "Compiling..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Workspace: File Tree & Sandboxed Iframe */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Explorer */}
        <div className="w-64 bg-[#0C0F17] border-r border-[#1E2433] flex flex-col p-3 space-y-3">
          <div className="text-xs font-bold uppercase text-gray-400 flex items-center justify-between">
            <span>Project Explorer</span>
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="space-y-1">
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 cursor-pointer">
              <span>📄 index.html</span>
            </div>
            <div className="p-2 rounded-lg text-gray-400 hover:text-white text-xs flex items-center gap-2 cursor-pointer">
              <span>🎨 styles.css</span>
            </div>
            <div className="p-2 rounded-lg text-gray-400 hover:text-white text-xs flex items-center gap-2 cursor-pointer">
              <span>⚡ app.js</span>
            </div>
          </div>
        </div>

        {/* Right Sandbox Preview */}
        <div className="flex-1 flex flex-col bg-[#050608]">
          <div className="border-b border-[#1E2433] bg-[#0B0E14] px-6 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDevice("desktop")}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  device === "desktop" ? "bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40" : "text-gray-400"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDevice("tablet")}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  device === "tablet" ? "bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40" : "text-gray-400"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" /> Tablet (768px)
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  device === "mobile" ? "bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40" : "text-gray-400"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile (390px)
              </button>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sandbox Ready
            </div>
          </div>

          <div className="flex-1 p-4 flex justify-center items-center overflow-hidden bg-[#030406]">
            <iframe
              srcDoc={currentHtml}
              className={`h-full border border-gray-800 rounded-xl bg-white shadow-2xl transition-all duration-300 ${
                device === "desktop" ? "w-full" : device === "tablet" ? "w-[768px]" : "w-[390px]"
              }`}
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
