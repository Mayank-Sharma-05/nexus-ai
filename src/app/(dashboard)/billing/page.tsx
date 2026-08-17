"use client";

import React, { useState } from "react";
import { Zap, Check, CreditCard, Shield, Sparkles } from "lucide-react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (tier: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8 w-full">
      <div className="border-b border-[#1E2433] pb-6">
        <span className="badge-pill mb-2"><CreditCard className="w-3.5 h-3.5" /> Billing & Tiers</span>
        <h1 className="text-3xl font-extrabold text-white">Subscription & Usage Limits</h1>
        <p className="text-gray-400 text-sm">Scale your generation allowances with instant Stripe Checkout activation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Starter */}
        <div className="glass-panel p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-300">Starter Tier</h3>
            <div className="text-4xl font-extrabold text-white">$0 <span className="text-xs font-normal text-gray-500">/ month</span></div>
            <p className="text-xs text-gray-400">For students, job seekers, and indie experimentation.</p>
            <ul className="text-xs space-y-2 text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 50,000 Tokens / month</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 3 Website Generations</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 1 Portfolio with Subdomain</li>
            </ul>
          </div>
          <button className="w-full py-2.5 rounded-lg border border-gray-700 text-xs font-semibold text-gray-400" disabled>
            Current Active Tier
          </button>
        </div>

        {/* Pro Creator */}
        <div className="glass-panel p-6 space-y-6 flex flex-col justify-between border-2 border-cyan-400 relative shadow-glow-cyan">
          <div className="absolute -top-3 right-6 bg-cyan-400 text-black text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
            Most Popular
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-white">Pro Creator</h3>
            <div className="text-4xl font-extrabold text-cyan-400">$29 <span className="text-xs font-normal text-gray-400">/ month</span></div>
            <p className="text-xs text-gray-400">For developers, freelance builders, and creators.</p>
            <ul className="text-xs space-y-2 text-gray-200">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 5,000,000 Tokens / month</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Unlimited Full-Stack Websites</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 5 Portfolios + Custom Domains</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 500 MB pgvector RAG Storage</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Priority p95 Latency (&lt;40ms)</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout("PRO")}
            disabled={loading}
            className="w-full btn-electric py-2.5 text-xs font-bold shadow-lg"
          >
            {loading ? "Redirecting..." : "Upgrade to Pro Tier →"}
          </button>
        </div>

        {/* Enterprise */}
        <div className="glass-panel p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-300">Enterprise & Founders</h3>
            <div className="text-4xl font-extrabold text-white">$99 <span className="text-xs font-normal text-gray-500">/ month</span></div>
            <p className="text-xs text-gray-400">For startups with high-concurrency production workloads.</p>
            <ul className="text-xs space-y-2 text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 50,000,000 Tokens / month</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Dedicated High-Throughput VPC</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Team Shared Workspaces & RBAC</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 99.99% Guaranteed SLA</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout("ENTERPRISE")}
            disabled={loading}
            className="w-full glass-panel hover:border-cyan-400 py-2.5 text-xs font-bold transition"
          >
            Upgrade to Enterprise
          </button>
        </div>
      </div>
    </div>
  );
}
