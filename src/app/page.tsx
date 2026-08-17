"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Palette, FileText, Brain, FolderOpen, ArrowRight, Zap, Shield, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState<"chat" | "resume">("chat");

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-[#F9FAFB] selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08090C]/80 border-b border-[#1E2433] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-sm shadow-glow-cyan">
            ⚡
          </div>
          <span>NEXUS<span className="text-cyan-400">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
          <a href="#features" className="hover:text-cyan-400 transition">Modules</a>
          <a href="#demo" className="hover:text-cyan-400 transition">Interactive Demo</a>
          <a href="#pricing" className="hover:text-cyan-400 transition">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-semibold text-gray-300 hover:text-white px-4 py-2">
            Sign In
          </Link>
          <Link href="/dashboard" className="btn-electric px-5 py-2 text-xs uppercase tracking-wider">
            Launch Platform →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="badge-pill mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Autonomous AI Creation Platform
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          One AI. <br />
          <span className="gradient-text-electric">Unlimited Creation.</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          The unified autonomous workspace combining portfolio builder, conversational AI, ATS resume scoring, and enterprise document RAG.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <Link href="/resumes" className="btn-electric text-base px-8 py-4 flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Analyze Resume with AI
          </Link>
          <Link href="/dashboard" className="glass-panel px-8 py-4 text-base font-semibold hover:border-cyan-400 transition flex items-center justify-center gap-2">
            Explore Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Interactive Demo Showcase */}
        <div id="demo" className="w-full glass-panel p-2 rounded-2xl border border-gray-800 shadow-2xl text-left">
          <div className="flex items-center justify-between border-b border-gray-800/80 px-4 py-3 bg-[#0D1018]/90 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-gray-500 ml-2">nexus-studio // live-sandbox</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDemo("chat")}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                  activeDemo === "chat" ? "bg-cyan-950/80 border border-cyan-500/40 text-cyan-300" : "text-gray-400 hover:text-white"
                }`}
              >
                💬 AI Chat
              </button>
              <button
                onClick={() => setActiveDemo("resume")}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                  activeDemo === "resume" ? "bg-cyan-950/80 border border-cyan-500/40 text-cyan-300" : "text-gray-400 hover:text-white"
                }`}
              >
                📄 Resume ATS
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#090B10] rounded-b-xl min-h-[220px] flex items-center justify-center">
            {activeDemo === "chat" && (
              <div className="w-full space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xs text-blue-300 font-bold">U</div>
                  <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm text-gray-200">
                    How does pgvector HNSW indexing optimize cosine similarity for 10M vectors?
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-cyan-500/30 border border-cyan-400/40 flex items-center justify-center text-xs text-cyan-300 font-bold">⚡</div>
                  <div className="bg-[#121622] border border-gray-800 p-3 rounded-xl text-sm text-gray-200 flex-1">
                    HNSW (Hierarchical Navigable Small World) builds a multi-layer graph that reduces vector search complexity from linear O(N) to logarithmic O(log N)...
                  </div>
                </div>
              </div>
            )}

            {activeDemo === "resume" && (
              <div className="w-full flex items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">Alex Rivera — Senior Systems Engineer</div>
                  <div className="text-xs text-gray-400">Target Role: Principal Cloud Architect</div>
                  <div className="flex gap-2 pt-1">
                    <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">Keywords: 92%</span>
                    <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">Impact: 88%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-black text-cyan-400">88/100</div>
                    <div className="text-[10px] text-emerald-400 uppercase font-bold">Top 5% ATS Grade</div>
                  </div>
                  <Link href="/resumes" className="btn-electric text-xs py-2 px-3">
                    Scan Resume →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Animated Counter Ribbon */}
      <section className="py-12 border-y border-[#1E2433] bg-[#0B0E16]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white mb-1">AI-Powered</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Website Generation</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-cyan-400 mb-1">ATS</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Resume Optimization</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-400 mb-1">RAG</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Document Intelligence</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-400 mb-1">24/7</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Platform Availability</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="badge-pill mb-3">Modular Ecosystem</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Integrated AI Modules</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">Everything you need to conceptualize, write, scaffold, analyze, and deploy in one unified interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/chat" className="glass-panel p-6 hover:border-blue-400 transition group block">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition">AI Chat Assistant</h3>
            <p className="text-gray-400 text-sm mb-4">ChatGPT & Claude caliber conversational AI with real-time SSE streaming, voice chat, and intent routing.</p>
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">Open Module →</span>
          </Link>

          <Link href="/portfolios" className="glass-panel p-6 hover:border-indigo-400 transition group block">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-indigo-400 transition">AI Portfolio Builder</h3>
            <p className="text-gray-400 text-sm mb-4">5 distinct themes (*Cyber*, *Minimal*, *Terminal*, *Studio*, *Startup*) with 1-click subdomain deployment.</p>
            <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">Open Module →</span>
          </Link>

          <Link href="/resumes" className="glass-panel p-6 hover:border-emerald-400 transition group block">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition">Resume ATS Optimizer</h3>
            <p className="text-gray-400 text-sm mb-4">Deterministic 0-100 ATS scoring, job description keyword gap matrix, and interactive AI rewrite diffs.</p>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">Open Module →</span>
          </Link>

          <Link href="/rag" className="glass-panel p-6 hover:border-purple-400 transition group block">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition">RAG Knowledge Base</h3>
            <p className="text-gray-400 text-sm mb-4">Structure-aware chunking, pgvector HNSW search, and verifiable grounded source citations.</p>
            <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">Open Module →</span>
          </Link>

          <Link href="/workspace" className="glass-panel p-6 hover:border-amber-400 transition group block">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition">Project Workspace</h3>
            <p className="text-gray-400 text-sm mb-4">Centralized library of all generated artifacts with deep-copy duplication and 30-day recoverable trash.</p>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">Open Module →</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2433] py-8 text-center text-xs text-gray-500 bg-[#08090C]">
        <p>© 2026 Nexus AI Inc. Built autonomously with Next.js 15, TypeScript, Prisma, and Supabase.</p>
      </footer>
    </div>
  );
}
