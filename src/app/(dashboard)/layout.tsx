"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  MessageSquare,
  Palette,
  FileText,
  Brain,
  FolderOpen,
  CreditCard,
  Settings,
  ShieldAlert,
  Zap,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<"USER" | "ADMIN" | "SUPERADMIN">("ADMIN");

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Chat", href: "/chat", icon: MessageSquare },
    { label: "Portfolios", href: "/portfolios", icon: Palette },
    { label: "Resumes", href: "/resumes", icon: FileText },
    { label: "RAG Base", href: "/rag", icon: Brain },
    { label: "Workspace", href: "/workspace", icon: FolderOpen },
    { label: "Billing", href: "/billing", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
    ...(role === "ADMIN" || role === "SUPERADMIN"
      ? [{ label: "Admin Center", href: "/admin", icon: ShieldAlert, highlight: true }]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-[#F9FAFB]">
      {/* Top Testing Ribbon for Role Switching */}
      <div className="bg-[#0B0E16] border-b border-[#1E2433] px-6 py-1.5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="badge-pill py-0.5 text-[10px]">Permission Switcher:</span>
          <span>Simulate active role:</span>
          <button
            onClick={() => setRole("USER")}
            className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
              role === "USER" ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
            }`}
          >
            👤 User
          </button>
          <button
            onClick={() => setRole("ADMIN")}
            className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
              role === "ADMIN" ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
            }`}
          >
            🛡️ Admin
          </button>
          <button
            onClick={() => setRole("SUPERADMIN")}
            className={`px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
              role === "SUPERADMIN" ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-300" : "border-gray-800 bg-[#121622] text-gray-400"
            }`}
          >
            ⚡ Superadmin
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-4 font-mono text-[11px]">
          <span>Tokens: <strong className="text-cyan-400">48,920</strong></span>
          <span>Tier: <strong className="text-emerald-400">PRO CREATOR</strong></span>
        </div>
      </div>

      {/* Main Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#08090C]/90 backdrop-blur-xl border-b border-[#1E2433] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-xs shadow-glow-cyan">
            ⚡
          </div>
          <span>NEXUS<span className="text-cyan-400">AI</span></span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-cyan-950/80 border border-cyan-500/40 text-cyan-300"
                    : item.highlight
                    ? "text-rose-400 hover:bg-rose-950/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right User Actions */}
        <div className="flex items-center gap-4">
          <Link href="/billing" className="hidden sm:flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-900/50 transition">
            <Zap className="w-3.5 h-3.5" /> Upgrade
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
