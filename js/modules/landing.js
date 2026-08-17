/**
 * NEXUS AI — Landing Page View & Interactive Showcases
 * Implements Section 13: Hero with particle canvas, animated headline, live interactive demos,
 * animated stats, feature showcase cards, testimonials carousel, and CTAs.
 */

window.NexusLandingModule = {
  render() {
    return `
      <!-- Hero Section with Particle Canvas -->
      <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 py-20">
        <canvas id="hero-particle-canvas" class="absolute inset-0 w-full h-full pointer-events-auto"></canvas>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#08090C]/60 to-[#08090C] pointer-events-none"></div>

        <div class="relative z-10 max-w-5xl mx-auto text-center">
          <!-- Electric Pill Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-8 animate-pulse-glow shadow-sm">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Nexus AI 1.0 — The Unified Creation Platform
          </div>

          <!-- Main Hero Headline -->
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15]">
            One AI. <br class="hidden sm:inline">
            <span class="gradient-text-electric">Unlimited Creation.</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            The all-in-one AI creation studio unifying conversational intelligence, prompt-to-website generation, portfolio deployment, ATS resume scoring, and enterprise document RAG into a single workspace.
          </p>

          <!-- Primary CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onclick="window.nexusApp.navigate('website')" class="w-full sm:w-auto btn-electric text-base px-8 py-4">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Generate a Website in Seconds
            </button>
            <button onclick="window.nexusApp.navigate('chat')" class="w-full sm:w-auto btn-secondary text-base px-8 py-4">
              <i class="fa-solid fa-comments"></i> Explore AI Assistant
            </button>
          </div>

          <!-- Live Interactive Showcase Selector -->
          <div class="glass-panel p-2 rounded-2xl max-w-4xl mx-auto border border-gray-800 shadow-2xl">
            <div class="flex items-center justify-between border-b border-gray-800/80 px-4 py-3 bg-[#0D1018]/90 rounded-t-xl">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span class="text-xs font-mono text-gray-500 ml-2">nexus-ai-studio // live-interactive-preview</span>
              </div>
              <div class="flex gap-2">
                <button onclick="window.NexusLandingModule.switchDemoTab('website')" id="demo-tab-website" class="demo-tab-btn px-3 py-1 text-xs rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold">⚡ Website Gen</button>
                <button onclick="window.NexusLandingModule.switchDemoTab('chat')" id="demo-tab-chat" class="demo-tab-btn px-3 py-1 text-xs rounded-lg text-gray-400 hover:text-white font-medium">💬 Streaming Chat</button>
                <button onclick="window.NexusLandingModule.switchDemoTab('resume')" id="demo-tab-resume" class="demo-tab-btn px-3 py-1 text-xs rounded-lg text-gray-400 hover:text-white font-medium">📄 Resume ATS</button>
              </div>
            </div>

            <!-- Demo Content Area -->
            <div id="landing-demo-viewport" class="p-6 bg-[#090B10] rounded-b-xl text-left min-h-[260px] flex items-center justify-center">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>
      </section>

      <!-- Animated Counters Section -->
      <section class="py-14 border-y border-gray-800/60 bg-[#0A0D14]">
        <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div id="stat-sites" class="text-4xl font-extrabold text-white mb-1">0</div>
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Websites Generated</div>
          </div>
          <div>
            <div id="stat-ats" class="text-4xl font-extrabold text-cyan-400 mb-1">0</div>
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">ATS Score Avg Uplift</div>
          </div>
          <div>
            <div id="stat-tokens" class="text-4xl font-extrabold text-indigo-400 mb-1">0</div>
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Tokens Streamed Daily</div>
          </div>
          <div>
            <div id="stat-uptime" class="text-4xl font-extrabold text-emerald-400 mb-1">0</div>
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Global SLA Uptime</div>
          </div>
        </div>
      </section>

      <!-- 8-Module Unified Feature Grid -->
      <section class="py-24 px-6 max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="badge-pill mb-3">Modular Ecosystem</span>
          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Eight Powerful Creation Modules</h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-base">Everything you need to conceptualize, write, scaffold, analyze, and deploy in one seamless black-and-blue interface.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. AI Website Gen -->
          <div onclick="window.nexusApp.navigate('website')" class="glass-panel p-6 cursor-pointer hover:border-cyan-400 transition group">
            <div class="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl mb-4 group-hover:scale-110 transition">⚡</div>
            <h3 class="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition">AI Website Generator</h3>
            <p class="text-gray-400 text-sm mb-4">Prompt-to-full-stack web application generation with live sandboxed preview, component diffs, and instant ZIP source export.</p>
            <span class="text-xs text-cyan-400 font-semibold flex items-center gap-1">Launch Module →</span>
          </div>

          <!-- 2. AI Chat -->
          <div onclick="window.nexusApp.navigate('chat')" class="glass-panel p-6 cursor-pointer hover:border-blue-400 transition group">
            <div class="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4 group-hover:scale-110 transition">💬</div>
            <h3 class="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition">AI Conversational Assistant</h3>
            <p class="text-gray-400 text-sm mb-4">ChatGPT and Claude caliber conversational AI with token streaming, code syntax copy, multi-session history, and intent routing.</p>
            <span class="text-xs text-blue-400 font-semibold flex items-center gap-1">Launch Module →</span>
          </div>

          <!-- 3. AI Portfolio Builder -->
          <div onclick="window.nexusApp.navigate('portfolio')" class="glass-panel p-6 cursor-pointer hover:border-indigo-400 transition group">
            <div class="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl mb-4 group-hover:scale-110 transition">🎨</div>
            <h3 class="text-lg font-bold mb-2 text-white group-hover:text-indigo-400 transition">AI Portfolio Builder</h3>
            <p class="text-gray-400 text-sm mb-4">5 distinct themes (Minimal, Cyber, Terminal, Studio, Startup) with resume extraction and 1-click subdomain deployment.</p>
            <span class="text-xs text-indigo-400 font-semibold flex items-center gap-1">Launch Module →</span>
          </div>

          <!-- 4. Resume Analyzer -->
          <div onclick="window.nexusApp.navigate('resume')" class="glass-panel p-6 cursor-pointer hover:border-emerald-400 transition group">
            <div class="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl mb-4 group-hover:scale-110 transition">📄</div>
            <h3 class="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition">Resume ATS Analyzer</h3>
            <p class="text-gray-400 text-sm mb-4">Deterministic 0–100 ATS scoring, job description keyword gap matrix, and interactive AI rewrite diffs.</p>
            <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">Launch Module →</span>
          </div>

          <!-- 5. RAG Knowledge Base -->
          <div onclick="window.nexusApp.navigate('rag')" class="glass-panel p-6 cursor-pointer hover:border-purple-400 transition group">
            <div class="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl mb-4 group-hover:scale-110 transition">📚</div>
            <h3 class="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition">RAG Knowledge Base</h3>
            <p class="text-gray-400 text-sm mb-4">Structure-aware chunking, vector embeddings, and multi-document semantic retrieval with verifiable source citations.</p>
            <span class="text-xs text-purple-400 font-semibold flex items-center gap-1">Launch Module →</span>
          </div>

          <!-- 6. Project Workspace -->
          <div onclick="window.nexusApp.navigate('workspace')" class="glass-panel p-6 cursor-pointer hover:border-amber-400 transition group">
            <div class="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-4 group-hover:scale-110 transition">📂</div>
            <h3 class="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition">Unified Project Workspace</h3>
            <p class="text-gray-400 text-sm mb-4">Centralized library of all generated websites, portfolios, resume reports, and chat sessions with deep duplication and trash restore.</p>
            <span class="text-xs text-amber-400 font-semibold flex items-center gap-1">Launch Module →</span>
          </div>
        </div>
      </section>

      <!-- Testimonials Carousel -->
      <section class="py-20 bg-[#0A0D15] border-t border-gray-800/60 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <span class="badge-pill mb-3">Loved by Builders</span>
          <h2 class="text-3xl font-bold mb-10">What Creators & Engineers Are Saying</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div class="glass-panel p-6">
              <div class="flex items-center gap-3 mb-4">
                <img class="w-10 h-10 rounded-full border border-cyan-400/40" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar">
                <div>
                  <div class="font-bold text-white text-sm">Elena Rostova</div>
                  <div class="text-xs text-gray-400">Founder & CTO @ NeuroStream</div>
                </div>
              </div>
              <p class="text-sm text-gray-300 italic">"Nexus AI cut our MVP landing page development from 5 days to 4 minutes. The generated Tailwind code is shockingly clean and production-ready."</p>
            </div>
            <div class="glass-panel p-6">
              <div class="flex items-center gap-3 mb-4">
                <img class="w-10 h-10 rounded-full border border-cyan-400/40" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar">
                <div>
                  <div class="font-bold text-white text-sm">Marcus Vance</div>
                  <div class="text-xs text-gray-400">Senior Staff Engineer @ CloudScale</div>
                </div>
              </div>
              <p class="text-sm text-gray-300 italic">"The Resume ATS Analyzer gave me actionable bullet rewrites with quantifiable metrics that helped me secure 3 Tier-1 tech interviews in a week."</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Call To Action -->
      <section class="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">Ready to Experience <br><span class="gradient-text-electric">Unlimited AI Creation?</span></h2>
        <p class="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Start building websites, optimizing resumes, and interrogating your documents today.</p>
        <button onclick="window.nexusApp.navigate('website')" class="btn-electric text-lg px-10 py-4 shadow-2xl">
          Get Started with Nexus AI Free →
        </button>
      </section>
    `;
  },

  init() {
    // 1. Initialize Particle Background
    window.NexusAnimations.initParticleCanvas("hero-particle-canvas");

    // 2. Animate Counters
    window.NexusAnimations.animateCounter(document.getElementById("stat-sites"), 128400, 1500, "+");
    window.NexusAnimations.animateCounter(document.getElementById("stat-ats"), 94, 1500, "%");
    window.NexusAnimations.animateCounter(document.getElementById("stat-tokens"), 48, 1500, "M+");
    window.NexusAnimations.animateCounter(document.getElementById("stat-uptime"), 99, 1500, ".99%");

    // 3. Render Initial Demo Tab
    this.switchDemoTab("website");
  },

  switchDemoTab(tab) {
    const viewport = document.getElementById("landing-demo-viewport");
    if (!viewport) return;

    // Update active tab buttons
    document.querySelectorAll(".demo-tab-btn").forEach(btn => {
      btn.className = "demo-tab-btn px-3 py-1 text-xs rounded-lg text-gray-400 hover:text-white font-medium";
    });
    const activeBtn = document.getElementById(`demo-tab-${tab}`);
    if (activeBtn) {
      activeBtn.className = "demo-tab-btn px-3 py-1 text-xs rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold";
    }

    if (tab === "website") {
      viewport.innerHTML = `
        <div class="w-full flex flex-col md:flex-row items-center gap-6">
          <div class="flex-1 space-y-3">
            <div class="text-xs font-mono text-cyan-400 uppercase tracking-wider">Prompt Input:</div>
            <div class="bg-[#121622] p-3 rounded-lg border border-gray-800 text-sm text-gray-200">
              "Create a high-converting dark-mode SaaS landing page for an AI observability platform"
            </div>
            <div class="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <i class="fa-solid fa-circle-check"></i> Clean HTML5 + Tailwind CSS + Responsive Grid generated (24ms)
            </div>
            <button onclick="window.nexusApp.navigate('website')" class="btn-electric text-xs py-2 px-4 mt-2">
              Launch Live Builder Sandbox →
            </button>
          </div>
          <div class="w-full md:w-56 h-36 bg-[#08090D] border border-cyan-500/30 rounded-xl overflow-hidden shadow-lg p-3 flex flex-col justify-between">
            <div class="flex justify-between items-center border-b border-gray-800 pb-1">
              <span class="text-[10px] font-mono text-cyan-400">NexusFlow UI</span>
              <span class="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <div class="text-center py-2">
              <div class="text-xs font-bold text-white">Autonomous AI Telemetry</div>
              <div class="text-[10px] text-gray-400">p99: 41ms latency</div>
            </div>
            <div class="w-full bg-cyan-400 h-1.5 rounded-full"></div>
          </div>
        </div>
      `;
    } else if (tab === "chat") {
      viewport.innerHTML = `
        <div class="w-full space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xs text-blue-300 font-bold">U</div>
            <div class="bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm text-gray-200">
              How does pgvector HNSW indexing optimize cosine similarity search for 10M vectors?
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded bg-cyan-500/30 border border-cyan-400/40 flex items-center justify-center text-xs text-cyan-300 font-bold">⚡</div>
            <div class="bg-[#121622] border border-gray-800 p-3 rounded-xl text-sm text-gray-200 flex-1">
              <div id="demo-chat-stream">HNSW (Hierarchical Navigable Small World) constructs a multi-layer geometric graph structure that reduces search complexity from linear O(N) to logarithmic O(log N)...</div>
            </div>
          </div>
        </div>
      `;
    } else if (tab === "resume") {
      viewport.innerHTML = `
        <div class="w-full flex items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="text-sm font-bold text-white">Alex Rivera — Senior Full-Stack Engineer</div>
            <div class="text-xs text-gray-400">Target Role: Principal Systems Architect</div>
            <div class="flex gap-2 pt-1">
              <span class="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">Keywords: 92%</span>
              <span class="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">Impact: 85%</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-2xl font-black text-cyan-400">88/100</div>
              <div class="text-[10px] text-emerald-400 uppercase font-bold">Top 5% ATS Grade</div>
            </div>
            <button onclick="window.nexusApp.navigate('resume')" class="btn-electric text-xs py-2 px-3">
              Scan Resume →
            </button>
          </div>
        </div>
      `;
    }
  }
};
