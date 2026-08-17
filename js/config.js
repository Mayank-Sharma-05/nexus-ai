/**
 * NEXUS AI — Global Configurations & Mock Datasets
 * Providing high-fidelity preloaded assets for instant testing and realistic generations
 */

window.NEXUS_CONFIG = {
  APP_NAME: "Nexus AI",
  TAGLINE: "One AI. Unlimited Creation.",
  VERSION: "1.0.0",
  API_MODELS: [
    { id: "nexus-pro", name: "Nexus Ultra 3.7", description: "Flagship multi-modal reasoning engine (Recommended)", speed: "Fast" },
    { id: "gemini-flash", name: "Gemini 2.0 Flash", description: "Sub-second streaming & high concurrency", speed: "Instant" },
    { id: "claude-sonnet", name: "Claude 3.5 Sonnet", description: "World-class coding and architectural diffing", speed: "Normal" },
    { id: "gpt-4o", name: "GPT-4o Omni", description: "General reasoning & multi-document synthesis", speed: "Fast" }
  ],
  
  // Website Generator Preloaded Templates
  WEBSITE_TEMPLATES: {
    saas: {
      id: "saas",
      title: "NexusFlow — Modern AI Analytics Platform",
      category: "SaaS & Cloud",
      prompt: "Create a modern dark-mode SaaS landing page for an AI observability platform with hero, metrics, features, pricing matrix, and interactive CTA.",
      techStack: { framework: "Tailwind CSS + HTML5", responsive: true, animations: "CSS Keyframes", js: "Vanilla JS" },
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusFlow — Next-Gen AI Observability</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #08090D; color: #F3F4F6; }
    .glow-cyan { box-shadow: 0 0 35px rgba(0, 240, 255, 0.25); }
    .gradient-text { background: linear-gradient(135deg, #00F0FF 0%, #3B82F6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="selection:bg-cyan-500 selection:text-black">
  <!-- Nav -->
  <nav class="border-b border-gray-800/80 px-8 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50 bg-[#08090D]/80">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-lg">⚡</div>
      <span class="text-xl font-bold tracking-tight">NexusFlow</span>
    </div>
    <div class="hidden md:flex gap-8 text-sm text-gray-400">
      <a href="#features" class="hover:text-cyan-400 transition">Features</a>
      <a href="#metrics" class="hover:text-cyan-400 transition">Performance</a>
      <a href="#pricing" class="hover:text-cyan-400 transition">Pricing</a>
      <a href="#docs" class="hover:text-cyan-400 transition">Docs</a>
    </div>
    <button class="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-5 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition transform hover:-translate-y-0.5 text-sm">Get Started Free</button>
  </nav>

  <!-- Hero -->
  <header class="py-20 px-6 max-w-5xl mx-auto text-center relative">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
      ✨ Introducing NexusFlow 2.0 Engine
    </div>
    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
      Observe & Optimize <br><span class="gradient-text">Autonomous AI Workflows</span>
    </h1>
    <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
      Monitor token latency, trace LLM hallucination spikes, and reduce cloud inference costs by up to 64% with real-time semantic caching.
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button class="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-cyan-500/30 transition transform hover:-translate-y-0.5 text-base">Start 14-Day Free Trial</button>
      <button class="w-full sm:w-auto bg-gray-900 border border-gray-700 text-gray-200 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-800 hover:border-gray-600 transition text-base">Book Live Demo →</button>
    </div>

    <!-- Live Telemetry Card -->
    <div class="mt-16 bg-[#10141E] border border-gray-800 rounded-2xl p-6 glow-cyan text-left">
      <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-mono text-gray-400">cluster-us-east-1 // Live Stream</span>
        </div>
        <span class="text-xs font-mono text-cyan-400 font-bold">p99: 41ms • 99.99% Uptime</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-950/80 p-4 rounded-xl border border-gray-800/80">
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Active AI Agents</div>
          <div class="text-2xl font-bold text-white">1,482 <span class="text-xs text-emerald-400">+14%</span></div>
        </div>
        <div class="bg-gray-950/80 p-4 rounded-xl border border-gray-800/80">
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Tokens Processed</div>
          <div class="text-2xl font-bold text-cyan-400">84.2M / hr</div>
        </div>
        <div class="bg-gray-950/80 p-4 rounded-xl border border-gray-800/80">
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Cache Hit Rate</div>
          <div class="text-2xl font-bold text-indigo-400">79.6%</div>
        </div>
      </div>
    </div>
  </header>

  <!-- Features Grid -->
  <section id="features" class="py-16 px-6 max-w-6xl mx-auto border-t border-gray-900">
    <h2 class="text-3xl font-bold text-center mb-12">Built for high-scale LLM architectures</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#10141E] p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl mb-4">🔍</div>
        <h3 class="text-lg font-bold mb-2">Real-Time Hallucination Tracing</h3>
        <p class="text-gray-400 text-sm">Catch schema drifts and groundedness violations before your customers notice.</p>
      </div>
      <div class="bg-[#10141E] p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition">
        <div class="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl mb-4">⚡</div>
        <h3 class="text-lg font-bold mb-2">Semantic Token Caching</h3>
        <p class="text-gray-400 text-sm">Deduplicate repetitive prompt embeddings with sub-millisecond similarity queries.</p>
      </div>
      <div class="bg-[#10141E] p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition">
        <div class="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl mb-4">🛡️</div>
        <h3 class="text-lg font-bold mb-2">Guardrails & Prompt Defense</h3>
        <p class="text-gray-400 text-sm">Automated firewall blocks jailbreak attempts and PII exfiltration in real-time.</p>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing" class="py-16 px-6 max-w-5xl mx-auto border-t border-gray-900 text-center">
    <h2 class="text-3xl font-bold mb-4">Transparent, Scale-Ready Pricing</h2>
    <p class="text-gray-400 mb-12">No hidden fees. Upgrade or downgrade anytime.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div class="bg-[#10141E] p-6 rounded-2xl border border-gray-800">
        <h3 class="font-bold text-gray-300">Starter</h3>
        <div class="text-3xl font-extrabold my-3">$29 <span class="text-sm font-normal text-gray-500">/ mo</span></div>
        <p class="text-xs text-gray-400 mb-6">For indie developers & MVPs</p>
        <ul class="text-sm space-y-2 text-gray-300 mb-6">
          <li>✓ 5M Tokens/month</li>
          <li>✓ 3 Active Agent Traces</li>
          <li>✓ 7-Day History Retention</li>
        </ul>
        <button class="w-full py-2.5 rounded-lg border border-gray-700 hover:border-cyan-400 text-sm font-semibold transition">Select Plan</button>
      </div>
      <div class="bg-[#141926] p-6 rounded-2xl border-2 border-cyan-400 shadow-xl relative">
        <div class="absolute -top-3 right-6 bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
        <h3 class="font-bold text-white">Growth</h3>
        <div class="text-3xl font-extrabold my-3 text-cyan-400">$99 <span class="text-sm font-normal text-gray-400">/ mo</span></div>
        <p class="text-xs text-gray-400 mb-6">For scaling tech companies</p>
        <ul class="text-sm space-y-2 text-gray-300 mb-6">
          <li>✓ 50M Tokens/month</li>
          <li>✓ Unlimited Agent Traces</li>
          <li>✓ Semantic Caching Layer</li>
          <li>✓ SOC2 Type II Certified</li>
        </ul>
        <button class="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm shadow-md transition">Start Free Trial</button>
      </div>
      <div class="bg-[#10141E] p-6 rounded-2xl border border-gray-800">
        <h3 class="font-bold text-gray-300">Enterprise</h3>
        <div class="text-3xl font-extrabold my-3">Custom</div>
        <p class="text-xs text-gray-400 mb-6">For global workloads</p>
        <ul class="text-sm space-y-2 text-gray-300 mb-6">
          <li>✓ Dedicated Cluster VPC</li>
          <li>✓ Custom SLA (99.99%)</li>
          <li>✓ On-Premise Gateway</li>
        </ul>
        <button class="w-full py-2.5 rounded-lg border border-gray-700 hover:border-cyan-400 text-sm font-semibold transition">Contact Sales</button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-gray-900 py-8 text-center text-xs text-gray-600">
    <p>© 2026 NexusFlow Inc. Built autonomously with Nexus AI Platform.</p>
  </footer>
</body>
</html>`
      }
    },
    gym: {
      id: "gym",
      title: "Apex Cyber Fitness & High-Performance Club",
      category: "Fitness & Wellness",
      prompt: "Generate a cutting-edge dark luxury fitness website with workout schedules, personal trainer profiles, and membership pass booking.",
      techStack: { framework: "Tailwind CSS + HTML5", responsive: true, animations: "Smooth Scroll", js: "Interactive Tabs" },
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APEX FITNESS // Redefine Human Performance</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background: #060709; color: #FFF; }</style>
</head>
<body class="bg-[#060709]">
  <nav class="p-6 flex justify-between items-center border-b border-zinc-800">
    <div class="text-2xl font-extrabold tracking-tighter text-cyan-400">APEX<span class="text-white">FIT</span></div>
    <div class="space-x-6 text-sm text-zinc-400">
      <a href="#trainers" class="hover:text-cyan-400">Elite Trainers</a>
      <a href="#passes" class="hover:text-cyan-400">Passes</a>
      <a href="#schedule" class="hover:text-cyan-400">Schedule</a>
    </div>
    <button class="bg-cyan-400 text-black px-5 py-2 rounded-md font-bold text-sm hover:bg-cyan-300">Book Session</button>
  </nav>
  <header class="py-24 px-6 text-center max-w-4xl mx-auto">
    <h1 class="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">Science-Backed <br><span class="text-cyan-400">Hypertrophy & Conditioning</span></h1>
    <p class="text-zinc-400 text-lg mb-8">Bio-metric tracked resistance training, cryotherapy chambers, and Olympic weightlifting zones.</p>
    <div class="flex justify-center gap-4">
      <button class="bg-cyan-400 text-black font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-cyan-300">Claim 3-Day VIP Pass</button>
      <button class="border border-zinc-700 px-8 py-3 rounded-lg hover:border-zinc-500">Virtual Tour</button>
    </div>
  </header>
  <section id="trainers" class="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <div class="h-44 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-4xl">🏋️‍♂️</div>
      <h3 class="text-xl font-bold">Marcus Vance</h3>
      <p class="text-cyan-400 text-xs font-semibold uppercase mb-2">Biomechanics & Powerlifting</p>
      <p class="text-zinc-400 text-sm">Olympic coach with 12+ years of conditioning world champions.</p>
    </div>
    <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <div class="h-44 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-4xl">🏃‍♀️</div>
      <h3 class="text-xl font-bold">Elena Rostova</h3>
      <p class="text-cyan-400 text-xs font-semibold uppercase mb-2">HIIT & Metabolic Conditioning</p>
      <p class="text-zinc-400 text-sm">Specializing in VO2 max optimization and athletic endurance.</p>
    </div>
    <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <div class="h-44 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-4xl">🧘</div>
      <h3 class="text-xl font-bold">Kai Tanaka</h3>
      <p class="text-cyan-400 text-xs font-semibold uppercase mb-2">Mobility & Hyper-Recovery</p>
      <p class="text-zinc-400 text-sm">Physical therapist and functional movement specialist.</p>
    </div>
  </section>
</body>
</html>`
      }
    },
    restaurant: {
      id: "restaurant",
      title: "L'Aura Gastronomy & Cocktail Lounge",
      category: "Culinary Luxury",
      prompt: "Create an elegant luxury restaurant website with signature tasting menus, private dining reservation system, and sommelier picks.",
      techStack: { framework: "Tailwind CSS + HTML5", responsive: true, animations: "Fade-in", js: "Reservation Modal" },
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>L'AURA // Modern French Gastronomy</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0A0A0A; color: #E5E7EB; }
    h1, h2, h3, .serif { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="bg-[#0A0A0A]">
  <nav class="p-8 flex justify-between items-center border-b border-stone-800">
    <div class="serif text-2xl tracking-widest text-amber-200">L'AURA</div>
    <div class="space-x-8 text-xs uppercase tracking-widest text-stone-400">
      <a href="#menu" class="hover:text-amber-200">Tasting Menu</a>
      <a href="#wine" class="hover:text-amber-200">Wine Cellar</a>
      <a href="#reserve" class="hover:text-amber-200">Reservations</a>
    </div>
    <button class="border border-amber-300/40 text-amber-200 px-6 py-2 rounded-full text-xs uppercase tracking-wider hover:bg-amber-300/10">Book Table</button>
  </nav>
  <header class="py-24 px-6 text-center max-w-3xl mx-auto">
    <div class="text-xs uppercase tracking-widest text-amber-300/70 mb-4">Michelin Three Stars • Manhattan</div>
    <h1 class="text-5xl md:text-6xl font-normal leading-tight mb-6">Culinary Poetry <br><span class="italic text-amber-200">Rooted in Tradition</span></h1>
    <p class="text-stone-400 text-sm leading-relaxed mb-8">An immersive 9-course sensory journey curated by Executive Chef Jean-Luc Laurent.</p>
    <button class="bg-amber-200 text-black px-8 py-3 rounded-full text-xs uppercase font-bold tracking-widest hover:bg-amber-100">Reserve an Evening</button>
  </header>
</body>
</html>`
      }
    },
    crypto: {
      id: "crypto",
      title: "NovaDEX — Decentralized Liquidity Engine",
      category: "Web3 & DeFi",
      prompt: "Build a high-performance decentralized exchange landing page with live swap widget, liquidity pools, and APY yield counters.",
      techStack: { framework: "Tailwind CSS + HTML5", responsive: true, animations: "Cyber Glow", js: "Swap Calculator" },
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaDEX // Sub-Second Liquidity & Swap</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background: #06070B; color: #F3F4F6; }</style>
</head>
<body class="bg-[#06070B] min-h-screen">
  <nav class="p-6 flex justify-between items-center border-b border-gray-800 backdrop-blur sticky top-0 z-50">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-black">◆</div>
      <span class="text-xl font-black">Nova<span class="text-cyan-400">DEX</span></span>
    </div>
    <div class="hidden md:flex gap-6 text-sm text-gray-400">
      <a href="#swap" class="hover:text-cyan-400">Trade</a>
      <a href="#pools" class="hover:text-cyan-400">Yield Pools</a>
      <a href="#governance" class="hover:text-cyan-400">Governance</a>
    </div>
    <button class="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-5 py-2 rounded-lg font-bold text-xs">Connect Wallet</button>
  </nav>

  <main class="max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
    <div class="flex-1 space-y-6">
      <span class="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full">⚡ Zero Slippage Aggregation</span>
      <h1 class="text-5xl font-black tracking-tight leading-tight">Trade Crypto with <br><span class="text-cyan-400">Sub-Millisecond Finality</span></h1>
      <p class="text-gray-400 text-sm">Deep aggregated liquidity across 14 EVM chains with automated MEV protection.</p>
      <div class="flex gap-4">
        <div class="bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex-1">
          <div class="text-xs text-gray-500 font-mono uppercase">24h Volume</div>
          <div class="text-2xl font-bold text-white">$148.2M</div>
        </div>
        <div class="bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex-1">
          <div class="text-xs text-gray-500 font-mono uppercase">Total Value Locked</div>
          <div class="text-2xl font-bold text-cyan-400">$640.8M</div>
        </div>
      </div>
    </div>

    <!-- Swap Widget -->
    <div class="w-full md:w-96 bg-[#0E121B] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
      <div class="flex justify-between items-center text-xs font-bold text-gray-300">
        <span>Instant Swap</span>
        <span class="text-cyan-400 font-mono">0.05% Fee</span>
      </div>
      <div class="bg-black/60 p-3 rounded-xl border border-gray-800">
        <div class="flex justify-between text-xs text-gray-500 mb-1"><span>You Pay</span> <span>Bal: 4.82 ETH</span></div>
        <div class="flex justify-between items-center">
          <input type="text" value="1.0" class="bg-transparent text-xl font-bold text-white outline-none w-24">
          <span class="bg-gray-800 text-white text-xs px-2.5 py-1 rounded font-bold">ETH ▼</span>
        </div>
      </div>
      <div class="flex justify-center -my-2">
        <button class="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-xs shadow-md">↓</button>
      </div>
      <div class="bg-black/60 p-3 rounded-xl border border-gray-800">
        <div class="flex justify-between text-xs text-gray-500 mb-1"><span>You Receive (Estimated)</span> <span>Bal: 0.00 USDC</span></div>
        <div class="flex justify-between items-center">
          <input type="text" value="3,482.50" class="bg-transparent text-xl font-bold text-cyan-400 outline-none w-32" readonly>
          <span class="bg-gray-800 text-white text-xs px-2.5 py-1 rounded font-bold">USDC ▼</span>
        </div>
      </div>
      <button class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-sm hover:brightness-110 shadow-lg">Swap Tokens Now</button>
    </div>
  </main>
</body>
</html>`
      }
    }
  },

  // Resume Sample Resumes for Instant Evaluation
  SAMPLE_RESUMES: {
    swe: {
      name: "Alex Rivera — Senior Full-Stack Engineer",
      role: "Senior Software Engineer",
      atsScore: 88,
      subScores: {
        keywords: 92,
        impact: 85,
        formatting: 95,
        skills: 88,
        structure: 80
      },
      text: `ALEX RIVERA
alex.rivera@example.com | (555) 234-5678 | San Francisco, CA | github.com/alexrivera | linkedin.com/in/alexrivera

SUMMARY:
Results-driven Senior Full-Stack Engineer with 6+ years of experience building high-throughput cloud microservices, distributed systems, and real-time streaming architectures. Led engineering squads to scale backend APIs serving 45M monthly requests with 99.99% uptime.

TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, Python, Go, SQL, HTML5/CSS3
- Frameworks & Libs: React, Next.js, FastAPI, Node.js, Express, Tailwind CSS
- Databases & Infrastructure: PostgreSQL, Redis, pgvector, Docker, Kubernetes, AWS (ECS, Lambda, S3, RDS), CI/CD (GitHub Actions)

PROFESSIONAL EXPERIENCE:
Senior Software Engineer | CloudScale Systems | 2022 - Present
- Architected and deployed a multi-tenant semantic vector search engine using FastAPI and pgvector, reducing median query latency from 320ms to 42ms.
- Scaled distributed Redis pub/sub streaming microservices processing over 12M events daily with zero data loss.
- Mentored 5 junior and mid-level engineers, establishing standardized code review rubrics and automated end-to-end testing pipelines.

Software Engineer | NextVenture Labs | 2019 - 2022
- Spearheaded the redesign of core SaaS customer portal using React and Next.js, improving page load speeds by 54% and boosting customer conversion by 22%.
- Integrated Stripe billing and automated webhook reconciliation, processing $4.2M in annual recurring subscriptions.`,
      missingKeywords: ["GraphQL", "Kafka", "Kubernetes Operator", "Terraform", "Prometheus"],
      matchedKeywords: ["TypeScript", "Python", "FastAPI", "PostgreSQL", "pgvector", "Docker", "AWS", "CI/CD", "Redis", "Microservices", "React", "Next.js"],
      suggestions: [
        {
          id: "sug-1",
          section: "Professional Experience (CloudScale Systems)",
          type: "Impact & Metrics",
          current: "Scaled distributed Redis pub/sub streaming microservices processing over 12M events daily with zero data loss.",
          improved: "Architected distributed Redis pub/sub streaming pipeline processing 12M+ daily events, cutting operational cloud infrastructure costs by $38K annually while maintaining zero packet loss.",
          status: "pending"
        },
        {
          id: "sug-2",
          section: "Summary Section",
          type: "Keyword Optimization",
          current: "Results-driven Senior Full-Stack Engineer with 6+ years of experience building high-throughput cloud microservices...",
          improved: "Senior Full-Stack Cloud Architect with 6+ years specializing in distributed systems, high-scale RAG AI integration, and zero-downtime microservices serving 45M+ monthly users.",
          status: "pending"
        }
      ]
    },
    pm: {
      name: "Samantha Chen — Principal Product Manager",
      role: "Lead / Principal PM",
      atsScore: 92,
      subScores: { keywords: 95, impact: 94, formatting: 90, skills: 92, structure: 89 },
      text: `SAMANTHA CHEN
samantha.chen@example.com | New York, NY | linkedin.com/in/samanthachen

SUMMARY:
Lead Product Manager with 8+ years scaling B2B enterprise SaaS and AI-driven workflow solutions from $2M to $28M ARR. Proven track record in product-led growth (PLG), cross-functional roadmap execution, and customer retention.`,
      missingKeywords: ["SQL Analytics", "Product Marketing", "Cohort Retention Modeling"],
      matchedKeywords: ["Product Management", "B2B SaaS", "Roadmap Execution", "PLG", "AI Workflows", "A/B Testing", "User Journey"],
      suggestions: [
        {
          id: "sug-3",
          section: "Executive Summary",
          type: "Quantifiable Impact",
          current: "Lead Product Manager with 8+ years scaling B2B enterprise SaaS...",
          improved: "Data-driven Lead Product Manager with 8+ years orchestrating B2B enterprise SaaS and AI applications, scaling ARR from $2M to $28M while reducing customer churn by 32%.",
          status: "pending"
        }
      ]
    }
  },

  // RAG Preloaded Sample Knowledge Base Documents
  RAG_DOCUMENTS: [
    {
      id: "doc-1",
      fileName: "Nexus_AI_Architecture_Spec.pdf",
      fileType: "pdf",
      size: "2.4 MB",
      status: "ready",
      chunksCount: 8,
      chunks: [
        {
          index: 1,
          section: "1.0 Executive Overview",
          content: "Nexus AI is an autonomous, all-in-one AI creation platform consolidating chat assistance, full-stack website generation, portfolio builder, resume ATS analyzer, and document RAG into a single unified workspace.",
          embeddingModel: "text-embedding-3-small (768d)"
        },
        {
          index: 2,
          section: "2.3 AI Router Engine",
          content: "The AI Intent Router classifies incoming user queries into general_chat, website_generation, portfolio_builder, or resume_scoring. The router automatically injects specialized system prompts and passes context seamlessly.",
          embeddingModel: "text-embedding-3-small (768d)"
        },
        {
          index: 3,
          section: "5.1 Storage & Vector Search",
          content: "Vector embeddings are indexed with pgvector HNSW cosine distance metric. Query retrieval employs top-k (k=5) with similarity threshold 0.72 to guarantee zero hallucinations and grounded source citations.",
          embeddingModel: "text-embedding-3-small (768d)"
        }
      ]
    },
    {
      id: "doc-2",
      fileName: "Enterprise_Security_Compliance_2026.docx",
      fileType: "docx",
      size: "1.1 MB",
      status: "ready",
      chunksCount: 5,
      chunks: [
        {
          index: 1,
          section: "3.2 Data Encryption at Rest",
          content: "All user documents, prompt histories, and refresh token hashes are encrypted using AES-256 GCM. Storage buckets are isolated on private subnets with short-lived pre-signed URLs.",
          embeddingModel: "text-embedding-3-small (768d)"
        }
      ]
    }
  ]
};
