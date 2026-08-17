"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen, Zap, Palette, FileText, Download, Copy, Trash2, ArrowRight, Loader2 } from "lucide-react";

export default function WorkspacePage() {
  const [filter, setFilter] = useState<"all" | "portfolio" | "resume">("all");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/workspace/projects");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "all" ? projects : projects.filter((p) => p.type.toLowerCase() === filter);

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2433] pb-6">
        <div>
          <span className="badge-pill mb-2">Module 7 — Workspace</span>
          <h1 className="text-3xl font-extrabold text-white">Central Project Workspace</h1>
          <p className="text-gray-400 text-sm">Unified library of all your generated websites, portfolios, and resume reports.</p>
        </div>

        <div className="flex gap-2">
          <Link href="/websites" className="btn-electric text-xs py-2 px-4">
            + New Website
          </Link>
          <Link href="/portfolios" className="glass-panel text-xs py-2 px-3 hover:border-cyan-400">
            + New Portfolio
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            filter === "all" ? "border-cyan-400 bg-cyan-950/60 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
          }`}
        >
          All Artifacts ({projects.length})
        </button>
        <button
          onClick={() => setFilter("portfolio")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            filter === "portfolio" ? "border-cyan-400 bg-cyan-950/60 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
          }`}
        >
          🎨 Portfolios
        </button>
        <button
          onClick={() => setFilter("resume")}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            filter === "resume" ? "border-cyan-400 bg-cyan-950/60 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
          }`}
        >
          📄 Resumes
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 italic py-12">
            No projects found. Start creating portfolios or resume analyses.
          </div>
        ) : (
          filtered.map((project) => (
            <div key={project.id} className="glass-panel p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-pill text-[10px]">
                    {project.type === "PORTFOLIO" ? "🎨 Portfolio" : "📄 Resume ATS"}
                  </span>
                  <span className="text-[11px] text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {project.type === "PORTFOLIO" && project.portfolio ? `${project.portfolio.theme} theme portfolio` :
                   project.type === "RESUME_REPORT" && project.resumeAnalysis ? `ATS Score: ${project.resumeAnalysis.atsScore}/100` :
                   "Project"}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                <Link 
                  href={`/${project.type === "PORTFOLIO" ? "portfolios" : "resumes"}`} 
                  className="btn-electric text-xs py-1 px-3 flex items-center gap-1"
                >
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center gap-1 text-gray-500">
                  <button title="Duplicate" className="p-1.5 hover:text-white transition">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button title="Move to Trash" className="p-1.5 hover:text-rose-400 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
