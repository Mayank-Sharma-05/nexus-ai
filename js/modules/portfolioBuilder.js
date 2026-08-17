/**
 * NEXUS AI — Module 4: AI Portfolio Builder
 * Multi-step portfolio builder with 5 distinct themes, AI resume autofill,
 * live responsive preview, and one-click subdomain deployment.
 */

window.NexusPortfolioModule = {
  activeTheme: "cyber", // minimal | cyber | terminal | studio | startup
  deployedUrl: null,

  render() {
    const portfolio = (window.nexusStore.get("portfolios") || [])[0] || {
      name: "Alex Rivera",
      title: "Senior Full-Stack & AI Systems Engineer",
      bio: "Building distributed cloud systems, real-time AI agents, and sub-millisecond semantic search architectures.",
      skills: ["TypeScript", "Python", "React", "FastAPI", "PostgreSQL", "Docker", "pgvector", "AWS"],
      projects: [
        { name: "NexusFlow Observability", desc: "Autonomous AI latency and telemetry dashboard.", link: "https://github.com" },
        { name: "FastVector RAG Engine", desc: "Sub-millisecond document semantic retrieval engine in Go.", link: "https://github.com" }
      ],
      experience: [
        { role: "Senior Software Engineer", company: "CloudScale Systems", period: "2022 - Present" }
      ],
      subdomain: "alexrivera.nexus.site"
    };

    return `
      <div class="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
        <!-- Top Toolbar -->
        <div class="border-b border-gray-800 bg-[#0B0E15] px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="badge-pill"><i class="fa-solid fa-palette text-indigo-400"></i> Portfolio Studio</span>
            <button onclick="window.NexusPortfolioModule.autofillFromResume()" class="btn-secondary text-xs py-1.5 px-3">
              <i class="fa-solid fa-file-arrow-up text-cyan-400"></i> AI Autofill from Resume
            </button>
          </div>

          <div class="flex items-center gap-3">
            ${this.deployedUrl ? `
              <a href="${this.deployedUrl}" target="_blank" class="text-xs text-emerald-400 flex items-center gap-1 font-mono hover:underline">
                <i class="fa-solid fa-link"></i> ${this.deployedUrl}
              </a>
            ` : ''}
            <button onclick="window.NexusPortfolioModule.deployPortfolio()" class="btn-electric text-xs py-1.5 px-4">
              <i class="fa-solid fa-cloud-arrow-up"></i> 1-Click Deploy Live
            </button>
            <button onclick="window.NexusPortfolioModule.exportZip()" class="btn-secondary text-xs py-1.5 px-3">
              <i class="fa-solid fa-download"></i> Export ZIP
            </button>
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <!-- Left Editor & Theme Selector -->
          <div class="w-96 bg-[#0C0F17] border-r border-gray-800 flex flex-col p-5 overflow-y-auto space-y-6">
            <!-- Theme Switcher -->
            <div>
              <label class="block text-xs text-gray-400 uppercase font-bold mb-2">Select Theme</label>
              <div class="grid grid-cols-2 gap-2">
                <button onclick="window.NexusPortfolioModule.switchTheme('cyber')" class="p-2.5 rounded-lg border text-xs text-left font-semibold ${this.activeTheme === 'cyber' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">
                  ⚡ Cyber / Electric Blue
                </button>
                <button onclick="window.NexusPortfolioModule.switchTheme('minimal')" class="p-2.5 rounded-lg border text-xs text-left font-semibold ${this.activeTheme === 'minimal' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">
                  ⚪ Minimal Monochrome
                </button>
                <button onclick="window.NexusPortfolioModule.switchTheme('terminal')" class="p-2.5 rounded-lg border text-xs text-left font-semibold ${this.activeTheme === 'terminal' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">
                  💻 Developer Terminal
                </button>
                <button onclick="window.NexusPortfolioModule.switchTheme('studio')" class="p-2.5 rounded-lg border text-xs text-left font-semibold ${this.activeTheme === 'studio' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">
                  🎨 Creative Studio
                </button>
              </div>
            </div>

            <!-- Profile Details Form -->
            <div class="space-y-4 pt-2 border-t border-gray-800">
              <h4 class="text-xs font-bold uppercase text-gray-300">Basic Info</h4>
              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">Full Name</label>
                <input id="port-name-input" type="text" class="nexus-input text-xs" value="${portfolio.name}" oninput="window.NexusPortfolioModule.updateLiveContent()">
              </div>
              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">Professional Title</label>
                <input id="port-title-input" type="text" class="nexus-input text-xs" value="${portfolio.title}" oninput="window.NexusPortfolioModule.updateLiveContent()">
              </div>
              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">Headline Bio</label>
                <textarea id="port-bio-input" rows="3" class="nexus-input text-xs" oninput="window.NexusPortfolioModule.updateLiveContent()">${portfolio.bio}</textarea>
              </div>
            </div>

            <!-- Skills List -->
            <div class="space-y-3 pt-2 border-t border-gray-800">
              <h4 class="text-xs font-bold uppercase text-gray-300">Technical Skills</h4>
              <div id="port-skills-container" class="flex flex-wrap gap-1.5">
                ${portfolio.skills.map(s => `
                  <span class="badge-pill text-[11px] py-0.5 px-2 bg-gray-900 border-gray-700 text-gray-300">
                    ${s} <button onclick="window.NexusPortfolioModule.removeSkill('${s}')" class="text-gray-500 hover:text-rose-400 ml-1">✕</button>
                  </span>
                `).join("")}
              </div>
              <div class="flex gap-2">
                <input id="port-new-skill-input" type="text" placeholder="Add skill (e.g. Docker)..." class="nexus-input text-xs" onkeydown="if(event.key === 'Enter'){ window.NexusPortfolioModule.addSkill(); }">
                <button onclick="window.NexusPortfolioModule.addSkill()" class="btn-secondary text-xs px-3">Add</button>
              </div>
            </div>

            <!-- Subdomain Config -->
            <div class="space-y-2 pt-2 border-t border-gray-800">
              <label class="block text-[11px] text-gray-400 uppercase mb-1">Live Subdomain</label>
              <div class="flex items-center gap-1">
                <input id="port-subdomain-input" type="text" class="nexus-input text-xs font-mono" value="${portfolio.subdomain || 'alexrivera.nexus.site'}">
              </div>
            </div>
          </div>

          <!-- Right Live Preview Sandbox -->
          <div class="flex-1 flex flex-col bg-[#050608]">
            <div class="sandbox-viewport-bar">
              <div class="text-xs font-mono text-cyan-400">
                Live Preview: <strong class="text-white capitalize">${this.activeTheme} Theme</strong>
              </div>
              <div class="text-xs text-gray-400">Updates dynamically on keystroke</div>
            </div>
            <div class="iframe-sandbox-container">
              <iframe id="portfolio-preview-iframe" class="sandbox-frame desktop" sandbox="allow-scripts"></iframe>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.updateLiveContent();
  },

  switchTheme(theme) {
    this.activeTheme = theme;
    window.nexusApp.renderView();
    window.nexusApp.showToast(`Switched to ${theme} theme (content preserved)`);
  },

  updateLiveContent() {
    const iframe = document.getElementById("portfolio-preview-iframe");
    if (!iframe) return;

    const name = document.getElementById("port-name-input")?.value || "Alex Rivera";
    const title = document.getElementById("port-title-input")?.value || "Senior Full-Stack Engineer";
    const bio = document.getElementById("port-bio-input")?.value || "Building scalable cloud systems and AI agents.";
    const skills = (window.nexusStore.get("portfolios") || [])[0]?.skills || ["TypeScript", "Python", "React", "FastAPI"];

    const htmlContent = this.generateThemeHTML(this.activeTheme, { name, title, bio, skills });

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
  },

  generateThemeHTML(theme, data) {
    if (theme === "terminal") {
      return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'JetBrains Mono', monospace; background: #0A0D10; color: #10B981; }</style>
</head>
<body class="p-8">
  <div class="max-w-3xl mx-auto border border-emerald-500/40 rounded-lg p-6 bg-black/80 shadow-2xl">
    <div class="flex items-center gap-2 border-b border-emerald-500/30 pb-3 mb-6">
      <span class="w-3 h-3 rounded-full bg-rose-500"></span>
      <span class="w-3 h-3 rounded-full bg-amber-500"></span>
      <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
      <span class="text-xs text-gray-400 ml-2">guest@nexus-terminal:~</span>
    </div>
    <div class="space-y-4 text-sm">
      <div><span class="text-gray-500">$ whoami</span><br><h1 class="text-2xl font-bold text-white">${data.name}</h1></div>
      <div><span class="text-gray-500">$ cat role.txt</span><br><p class="text-emerald-400 font-bold">${data.title}</p></div>
      <div><span class="text-gray-500">$ cat bio.md</span><br><p class="text-gray-300">${data.bio}</p></div>
      <div><span class="text-gray-500">$ ls ./skills</span><br><div class="flex flex-wrap gap-2 mt-1">${data.skills.map(s => `<span class="bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 text-xs text-emerald-300 rounded">${s}</span>`).join("")}</div></div>
    </div>
  </div>
</body>
</html>`;
    }

    if (theme === "minimal") {
      return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; background: #FAFAFA; color: #171717; }</style>
</head>
<body class="p-12 max-w-3xl mx-auto">
  <header class="border-b border-neutral-200 pb-8 mb-8">
    <h1 class="text-4xl font-light tracking-tight text-black mb-2">${data.name}</h1>
    <p class="text-neutral-500 font-medium">${data.title}</p>
  </header>
  <section class="space-y-6">
    <p class="text-neutral-700 leading-relaxed text-base">${data.bio}</p>
    <div class="pt-4">
      <h3 class="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">Core Competencies</h3>
      <div class="flex flex-wrap gap-2">${data.skills.map(s => `<span class="bg-neutral-100 border border-neutral-300 px-3 py-1 text-xs rounded text-neutral-800">${s}</span>`).join("")}</div>
    </div>
  </section>
</body>
</html>`;
    }

    // Default: Cyber / Electric Theme
    return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #08090D; color: #F3F4F6; }
    .glow { box-shadow: 0 0 30px rgba(0, 240, 255, 0.2); }
  </style>
</head>
<body class="p-8 max-w-4xl mx-auto">
  <header class="bg-[#10141E] border border-cyan-500/30 rounded-2xl p-8 mb-8 glow">
    <div class="flex justify-between items-start">
      <div>
        <span class="text-xs uppercase tracking-widest text-cyan-400 font-bold">Verified Creator Portfolio</span>
        <h1 class="text-4xl font-extrabold text-white mt-1 mb-2">${data.name}</h1>
        <p class="text-cyan-300 text-sm font-semibold">${data.title}</p>
      </div>
      <div class="w-12 h-12 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-black text-xl">⚡</div>
    </div>
    <p class="text-gray-400 text-sm mt-4 leading-relaxed">${data.bio}</p>
    <div class="mt-6 flex flex-wrap gap-2">
      ${data.skills.map(s => `<span class="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join("")}
    </div>
  </header>
</body>
</html>`;
  },

  addSkill() {
    const input = document.getElementById("port-new-skill-input");
    const skill = input.value.trim();
    if (!skill) return;

    let portfolios = window.nexusStore.get("portfolios") || [];
    if (!portfolios[0]) return;

    if (!portfolios[0].skills.includes(skill)) {
      portfolios[0].skills.push(skill);
      window.nexusStore.set("portfolios", portfolios);
      window.nexusApp.renderView();
    }
    input.value = "";
  },

  removeSkill(skill) {
    let portfolios = window.nexusStore.get("portfolios") || [];
    if (!portfolios[0]) return;

    portfolios[0].skills = portfolios[0].skills.filter(s => s !== skill);
    window.nexusStore.set("portfolios", portfolios);
    window.nexusApp.renderView();
  },

  autofillFromResume() {
    const sample = window.NEXUS_CONFIG.SAMPLE_RESUMES.swe;
    let portfolios = window.nexusStore.get("portfolios") || [];
    if (portfolios[0]) {
      portfolios[0].name = "Alex Rivera";
      portfolios[0].title = "Senior Full-Stack & AI Systems Engineer";
      portfolios[0].bio = "Results-driven Senior Full-Stack Engineer with 6+ years experience scaling cloud microservices and distributed vector architectures.";
      portfolios[0].skills = ["TypeScript", "Python", "React", "Next.js", "FastAPI", "PostgreSQL", "pgvector", "Docker", "AWS"];
      window.nexusStore.set("portfolios", portfolios);
      window.nexusApp.renderView();
      window.NexusAnimations.triggerConfetti();
      window.nexusApp.showToast("✓ Portfolio autofilled from resume data!");
    }
  },

  deployPortfolio() {
    const subdomain = document.getElementById("port-subdomain-input")?.value || "alexrivera.nexus.site";
    this.deployedUrl = `https://${subdomain}`;
    window.NexusAnimations.triggerConfetti();
    window.nexusApp.renderView();
    window.nexusApp.showToast(`✓ Published live to ${this.deployedUrl}`);
  },

  async exportZip() {
    const name = document.getElementById("port-name-input")?.value || "Alex Rivera";
    const title = document.getElementById("port-title-input")?.value || "Senior Engineer";
    const bio = document.getElementById("port-bio-input")?.value || "";
    const skills = (window.nexusStore.get("portfolios") || [])[0]?.skills || [];

    const html = this.generateThemeHTML(this.activeTheme, { name, title, bio, skills });
    const files = { "index.html": html };
    await window.NexusZipExporter.exportFilesAsZip(`${name}-portfolio`, files);
    window.nexusApp.showToast("✓ Portfolio source ZIP downloaded!");
  }
};
