"use client";

import React, { useState } from "react";
import { Palette, Globe, Sparkles, Download, Check, Loader2, FileArchive, FileText, File } from "lucide-react";

export default function PortfoliosPage() {
  const [theme, setTheme] = useState<"cyber" | "minimal" | "terminal" | "studio">("cyber");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [deployed, setDeployed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          bio,
          theme: theme.toUpperCase(),
          skills,
          subdomain: name.toLowerCase().replace(/\s+/g, ''),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeployed(true);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIAutofill = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/v1/portfolios/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setName(data.data.name || "");
        setTitle(data.data.title || "");
        setBio(data.data.bio || "");
        setSkills(data.data.skills || []);
      }
    } catch (error) {
      console.error("AI autofill failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportZIP = async () => {
    setIsExporting(true);
    try {
      const html = getThemePreview();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      const html = getThemePreview();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html = getThemePreview();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const getThemePreview = () => {
    if (theme === "terminal") {
      return `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"><style>body{font-family:'JetBrains Mono',monospace;background:#0A0D10;color:#10B981;padding:24px;}</style></head><body><div class="border border-emerald-500/40 p-6 rounded-lg bg-black"><p class="text-xs text-gray-400">$ whoami</p><h1 class="text-2xl font-bold text-white mb-4">${name}</h1><p class="text-xs text-gray-400">$ cat role.txt</p><p class="text-emerald-400 mb-4">${title}</p><p class="text-xs text-gray-400">$ cat bio.md</p><p class="text-gray-300 mb-4">${bio}</p><div class="flex flex-wrap gap-2">${skills.map(s=>`<span class="bg-emerald-950 px-2 py-0.5 text-xs text-emerald-300 rounded border border-emerald-500/40">${s}</span>`).join("")}</div></div></body></html>`;
    }
    if (theme === "minimal") {
      return `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>body{font-family:sans-serif;background:#FAFAFA;color:#171717;padding:32px;}</style></head><body><h1 class="text-4xl font-light mb-2">${name}</h1><p class="text-neutral-500 font-semibold mb-6">${title}</p><p class="text-neutral-700 leading-relaxed mb-6">${bio}</p><div class="flex flex-wrap gap-2">${skills.map(s=>`<span class="bg-neutral-200 px-3 py-1 text-xs rounded">${s}</span>`).join("")}</div></body></html>`;
    }
    // Default: Cyber Theme
    return `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>body{font-family:sans-serif;background:#08090D;color:#F3F4F6;padding:32px;}</style></head><body><div class="bg-[#10141E] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl"><div class="flex justify-between items-start"><div><span class="text-xs uppercase text-cyan-400 font-bold">Verified Portfolio</span><h1 class="text-3xl font-extrabold text-white mt-1">${name}</h1><p class="text-cyan-300 text-sm font-semibold">${title}</p></div><div class="w-10 h-10 rounded-lg bg-cyan-400 text-black flex items-center justify-center font-bold">⚡</div></div><p class="text-gray-400 text-xs mt-4 leading-relaxed">${bio}</p><div class="mt-6 flex flex-wrap gap-2">${skills.map(s=>`<span class="bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join("")}</div></div></body></html>`;
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-100px)] overflow-hidden">
      {/* Top Toolbar */}
      <div className="border-b border-[#1E2433] bg-[#0B0E15] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="badge-pill"><Palette className="w-3.5 h-3.5" /> Portfolio Studio</span>
          <button
            onClick={handleAIAutofill}
            disabled={isGenerating}
            className="glass-panel text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-cyan-400 disabled:opacity-50"
          >
            {isGenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</> : <><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Autofill</>}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting || !name.trim()}
              className="btn-electric text-xs py-1.5 px-4 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isExporting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Exporting...</> : <><Download className="w-3.5 h-3.5" /> Export Portfolio</>}
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#121622] border border-gray-800 rounded-lg shadow-xl z-50">
                <button
                  onClick={handleExportZIP}
                  className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                >
                  <FileArchive className="w-3.5 h-3.5" /> Download ZIP
                </button>
                <button
                  onClick={handleExportHTML}
                  className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" /> Export HTML
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                >
                  <File className="w-3.5 h-3.5" /> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Form */}
        <div className="w-96 bg-[#0C0F17] border-r border-[#1E2433] flex flex-col p-5 overflow-y-auto space-y-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Theme Selection</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme("cyber")}
                className={`p-2.5 rounded-lg border text-xs text-left font-semibold ${
                  theme === "cyber" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
                }`}
              >
                ⚡ Cyber Electric
              </button>
              <button
                onClick={() => setTheme("minimal")}
                className={`p-2.5 rounded-lg border text-xs text-left font-semibold ${
                  theme === "minimal" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
                }`}
              >
                ⚪ Minimal Monochrome
              </button>
              <button
                onClick={() => setTheme("terminal")}
                className={`p-2.5 rounded-lg border text-xs text-left font-semibold ${
                  theme === "terminal" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
                }`}
              >
                💻 Developer Terminal
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-800">
            <div>
              <label className="block text-[11px] text-gray-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#131722] border border-gray-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131722] border border-gray-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#131722] border border-gray-800 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 flex flex-col bg-[#050608]">
          <div className="border-b border-[#1E2433] bg-[#0B0E14] px-6 py-2 flex items-center justify-between text-xs text-gray-400">
            <span>Live Preview: <strong className="text-white capitalize">{theme} Theme</strong></span>
            <span>Subdomain: <strong className="text-cyan-400">alexrivera.nexus.site</strong></span>
          </div>
          <div className="flex-1 p-6 flex justify-center items-center">
            <iframe srcDoc={getThemePreview()} className="w-full h-full border border-gray-800 rounded-xl bg-white shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
