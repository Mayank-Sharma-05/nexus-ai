/**
 * NEXUS AI — Module 8: Dashboard & User Analytics
 * Metric summary cards, time-series interactive SVG analytics charts,
 * feature breakdown bars, and recent activity timeline.
 */

window.NexusDashboardModule = {
  activeRange: "daily", // daily | weekly | monthly

  render() {
    const user = window.nexusStore.get("user");
    const analytics = window.nexusStore.get("analytics");
    const websites = window.nexusStore.get("websites") || [];
    const chats = window.nexusStore.get("chats") || [];
    const docs = window.nexusStore.get("documents") || [];

    return `
      <div class="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <span class="badge-pill mb-2"><i class="fa-solid fa-chart-line text-cyan-400"></i> Module 8 — Analytics</span>
            <h1 class="text-3xl font-extrabold text-white">Platform Dashboard & Usage</h1>
            <p class="text-gray-400 text-sm">Real-time metrics, AI token consumption, and artifact performance.</p>
          </div>

          <div class="flex items-center gap-2 bg-[#121622] p-1 rounded-xl border border-gray-800 text-xs">
            <button onclick="window.NexusDashboardModule.setRange('daily')" class="px-3 py-1 rounded-lg ${this.activeRange === 'daily' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-gray-400'}">Daily</button>
            <button onclick="window.NexusDashboardModule.setRange('weekly')" class="px-3 py-1 rounded-lg ${this.activeRange === 'weekly' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-gray-400'}">Weekly</button>
            <button onclick="window.NexusDashboardModule.setRange('monthly')" class="px-3 py-1 rounded-lg ${this.activeRange === 'monthly' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-gray-400'}">Monthly</button>
          </div>
        </div>

        <!-- Headline Metric Bento Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div class="glass-panel p-5 space-y-2 border border-gray-800">
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span class="uppercase font-bold tracking-wider">Total Generations</span>
              <span class="w-7 h-7 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400">⚡</span>
            </div>
            <div class="text-3xl font-extrabold text-white">${analytics.totalGenerations}</div>
            <div class="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <i class="fa-solid fa-arrow-trend-up"></i> +18.4% vs last week
            </div>
          </div>

          <div class="glass-panel p-5 space-y-2 border border-gray-800">
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span class="uppercase font-bold tracking-wider">Tokens Streamed</span>
              <span class="w-7 h-7 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400">💬</span>
            </div>
            <div class="text-3xl font-extrabold text-white">${user.tokensConsumed.toLocaleString()}</div>
            <div class="text-[11px] text-cyan-400 font-mono">
              Model: Nexus Ultra 3.7
            </div>
          </div>

          <div class="glass-panel p-5 space-y-2 border border-gray-800">
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span class="uppercase font-bold tracking-wider">Storage Usage</span>
              <span class="w-7 h-7 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400">📦</span>
            </div>
            <div class="text-3xl font-extrabold text-white">${user.storageUsedMB} <span class="text-xs text-gray-500 font-normal">/ ${user.storageQuotaMB} MB</span></div>
            <div class="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div class="bg-purple-400 h-full" style="width: ${(user.storageUsedMB / user.storageQuotaMB) * 100}%"></div>
            </div>
          </div>

          <div class="glass-panel p-5 space-y-2 border border-gray-800">
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span class="uppercase font-bold tracking-wider">Incurred Cost (USD)</span>
              <span class="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400">💲</span>
            </div>
            <div class="text-3xl font-extrabold text-emerald-400">$${analytics.apiCostUSD.toFixed(2)}</div>
            <div class="text-[11px] text-gray-400">
              Within tier allowance
            </div>
          </div>
        </div>

        <!-- Interactive Charts & Breakdown Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Time-Series Chart (SVG rendered) -->
          <div class="glass-panel p-6 md:col-span-2 space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-chart-column text-cyan-400"></i> Generation & Token Velocity
              </h3>
              <span class="text-xs text-cyan-400 font-mono">Last 7 Days</span>
            </div>

            <!-- SVG Bar / Line Chart -->
            <div class="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-[#0A0D15] rounded-xl border border-gray-800">
              ${analytics.dailyActivity.map(d => {
                const heightPct = Math.min((d.tokens / 50000) * 100, 100);
                return `
                  <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div class="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition font-mono">${(d.tokens / 1000).toFixed(0)}k</div>
                    <div class="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125" style="height: ${heightPct}%"></div>
                    <span class="text-xs text-gray-400 font-medium">${d.day}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Feature Usage Breakdown -->
          <div class="glass-panel p-6 space-y-4">
            <h3 class="text-base font-bold text-white">Module Utilization</h3>
            <div class="space-y-3 text-xs">
              <div>
                <div class="flex justify-between text-gray-300 mb-1"><span>⚡ AI Website Generator</span> <strong>44%</strong></div>
                <div class="w-full bg-gray-900 h-2 rounded-full overflow-hidden"><div class="bg-cyan-400 h-full w-[44%]"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-gray-300 mb-1"><span>💬 AI Chat Assistant</span> <strong>28%</strong></div>
                <div class="w-full bg-gray-900 h-2 rounded-full overflow-hidden"><div class="bg-blue-400 h-full w-[28%]"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-gray-300 mb-1"><span>📄 Resume ATS Optimizer</span> <strong>16%</strong></div>
                <div class="w-full bg-gray-900 h-2 rounded-full overflow-hidden"><div class="bg-emerald-400 h-full w-[16%]"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-gray-300 mb-1"><span>📚 RAG Knowledge Base</span> <strong>12%</strong></div>
                <div class="w-full bg-gray-900 h-2 rounded-full overflow-hidden"><div class="bg-purple-400 h-full w-[12%]"></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="glass-panel p-6 space-y-4">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-gray-400"></i> Recent Workspace Activity
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-[#0D1018] border border-gray-800 text-xs">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">⚡</span>
                <div>
                  <div class="font-bold text-white">Generated NexusFlow SaaS Landing Page</div>
                  <div class="text-gray-500 text-[11px]">Compiled 3 files with zero lint errors</div>
                </div>
              </div>
              <button onclick="window.nexusApp.navigate('website')" class="btn-ghost text-xs text-cyan-400">View Sandbox →</button>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-[#0D1018] border border-gray-800 text-xs">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">📄</span>
                <div>
                  <div class="font-bold text-white">Scored Alex Rivera Resume (88/100 ATS)</div>
                  <div class="text-gray-500 text-[11px]">Matched 12 core keywords across distributed systems</div>
                </div>
              </div>
              <button onclick="window.nexusApp.navigate('resume')" class="btn-ghost text-xs text-emerald-400">View Report →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {},

  setRange(range) {
    this.activeRange = range;
    window.nexusApp.renderView();
    window.nexusApp.showToast(`Updated analytics view: ${range.toUpperCase()}`);
  }
};
