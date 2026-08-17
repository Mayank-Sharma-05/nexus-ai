"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, MessageSquare, HardDrive, DollarSign, ArrowUpRight, TrendingUp, Sparkles, FileText, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalGenerations: 0,
    tokensStreamed: 0,
    storageUsed: 0,
    storageLimit: 500 * 1024 * 1024, // 500 MB
    costUsd: 0,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [dailyVelocity, setDailyVelocity] = useState<Array<{ day: string; tokens: number }>>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch projects
      const projectsRes = await fetch("/api/v1/workspace/projects");
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
          setProjects(projectsData.data);
        }
      }

      // Fetch API usage logs for metrics
      const usageRes = await fetch("/api/v1/analytics/usage");
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        if (usageData.success) {
          setMetrics(usageData.data);
          setDailyVelocity(usageData.data.velocity || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8 w-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2433] pb-6">
        <div>
          <span className="badge-pill mb-2">Module 8 — Telemetry</span>
          <h1 className="text-3xl font-extrabold text-white">Platform Dashboard & Usage</h1>
          <p className="text-gray-400 text-sm">Real-time metrics, AI token consumption, and generation velocity.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#121622] p-1 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setRange("daily")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              range === "daily" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40" : "text-gray-400"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setRange("weekly")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              range === "weekly" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40" : "text-gray-400"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setRange("monthly")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              range === "monthly" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40" : "text-gray-400"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Headline Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase font-bold tracking-wider">Total Generations</span>
            <span className="w-7 h-7 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 font-bold">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : metrics.totalGenerations}</div>
          <div className="text-[11px] text-gray-400">All-time projects created</div>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase font-bold tracking-wider">Tokens Streamed</span>
            <span className="w-7 h-7 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400 font-bold">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : metrics.tokensStreamed.toLocaleString()}</div>
          <div className="text-[11px] text-cyan-400 font-mono">AI Streaming</div>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase font-bold tracking-wider">Storage Usage</span>
            <span className="w-7 h-7 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400 font-bold">
              <HardDrive className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                {(metrics.storageUsed / 1024 / 1024).toFixed(1)} MB
                <span className="text-xs text-gray-500 font-normal ml-1">/ 500 MB</span>
              </>
            )}
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full" style={{ width: `${(metrics.storageUsed / metrics.storageLimit) * 100}%` }} />
          </div>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="uppercase font-bold tracking-wider">Incurred Cost (USD)</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-bold">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `$${metrics.costUsd.toFixed(2)}`}</div>
          <div className="text-[11px] text-gray-400">Current billing period</div>
        </div>
      </div>

      {/* Time-Series Charts & Module Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Token Generation Velocity
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Last 7 Days (p95: 38ms)</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-[#0A0D15] rounded-xl border border-gray-800">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              </div>
            ) : dailyVelocity.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
                No usage data available yet
              </div>
            ) : (
              dailyVelocity.map((d) => {
                const heightPct = Math.min((d.tokens / 50000) * 100, 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition font-mono">
                      {(d.tokens / 1000).toFixed(0)}k
                    </div>
                    <div
                      className="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-xs text-gray-400 font-medium">{d.day}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Module Utilization</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {projects.length === 0 ? (
                <div className="text-gray-500 italic">No projects created yet</div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>🎨 Portfolio Builder</span> <strong>{projects.filter(p => p.type === 'PORTFOLIO').length}</strong>
                    </div>
                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full" style={{ width: `${projects.length > 0 ? (projects.filter(p => p.type === 'PORTFOLIO').length / projects.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>📄 Resume ATS Optimizer</span> <strong>{projects.filter(p => p.type === 'RESUME_REPORT').length}</strong>
                    </div>
                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full" style={{ width: `${projects.length > 0 ? (projects.filter(p => p.type === 'RESUME_REPORT').length / projects.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Recent Artifact Launches
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-gray-500 italic text-center py-8">
            No projects created yet. Start by generating a portfolio or resume analysis.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project) => (
              <Link 
                key={project.id} 
                href={`/${project.type === 'PORTFOLIO' ? 'portfolios' : 'resumes'}`} 
                className="p-4 rounded-xl bg-[#0D1018] border border-gray-800 hover:border-cyan-400 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold ${
                    project.type === 'PORTFOLIO' ? 'bg-indigo-950 border-indigo-500/30 text-indigo-400' :
                    'bg-emerald-950 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {project.type === 'PORTFOLIO' ? '🎨' : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white line-clamp-1">{project.title}</div>
                    <div className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
