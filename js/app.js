/**
 * NEXUS AI — Master Application Coordinator & Router
 * Unifies all 9 modules, handles seamless view navigation, top bar state,
 * quick testing role-switcher, and toast notifications.
 */

window.nexusApp = {
  currentView: "landing",

  init() {
    // 1. Listen for store changes
    window.nexusStore.on("currentView", (view) => {
      this.currentView = view;
      this.renderView();
    });

    window.nexusStore.on("user", () => {
      this.renderNav();
    });

    // 2. Initial route from hash or store
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    if (hash && ["landing", "chat", "website", "portfolio", "resume", "rag", "workspace", "dashboard", "admin", "profile"].includes(hash)) {
      this.currentView = hash;
    } else {
      this.currentView = window.nexusStore.get("currentView") || "landing";
    }

    // 3. Render
    this.renderNav();
    this.renderView();

    // 4. Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        this.openCommandPalette();
      }
    });
  },

  navigate(viewName) {
    this.currentView = viewName;
    window.nexusStore.set("currentView", viewName);
    window.location.hash = "#/" + viewName;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderView();
    this.renderNav();
  },

  renderNav() {
    const navRoot = document.getElementById("app-nav");
    if (!navRoot) return;

    const user = window.nexusStore.get("user");
    const activeView = this.currentView;

    navRoot.innerHTML = `
      <!-- Role Switcher & Testing Ribbon -->
      <div class="role-test-bar">
        <div class="flex items-center gap-2">
          <span class="badge-pill bg-cyan-950/80 border-cyan-500/40 text-cyan-300 text-[10px]">Demo Switcher:</span>
          <span>Switch account permissions:</span>
          <button onclick="window.nexusStore.setUserRole('user'); window.nexusApp.renderView();" class="role-switcher-btn ${user.role === 'user' ? 'active' : ''}">👤 Standard User</button>
          <button onclick="window.nexusStore.setUserRole('admin'); window.nexusApp.renderView();" class="role-switcher-btn ${user.role === 'admin' ? 'active' : ''}">🛡️ Admin</button>
          <button onclick="window.nexusStore.setUserRole('superadmin'); window.nexusApp.renderView();" class="role-switcher-btn ${user.role === 'superadmin' ? 'active' : ''}">⚡ Superadmin</button>
        </div>
        <div class="hidden sm:flex items-center gap-4 text-gray-500 font-mono">
          <span>Tokens: <strong class="text-cyan-400">${user.tokensConsumed.toLocaleString()}</strong></span>
          <span>Storage: <strong class="text-white">${user.storageUsedMB} MB</strong></span>
        </div>
      </div>

      <!-- Top Navigation Bar -->
      <nav class="top-nav">
        <!-- Logo -->
        <div onclick="window.nexusApp.navigate('landing')" class="nav-brand">
          <div class="nav-brand-icon">⚡</div>
          <span class="text-lg font-black tracking-tight text-white">NEXUS<span class="text-cyan-400">AI</span></span>
        </div>

        <!-- Center Nav Links -->
        <div class="nav-links">
          <button onclick="window.nexusApp.navigate('website')" class="nav-link-btn ${activeView === 'website' ? 'active' : ''}">
            <i class="fa-solid fa-wand-magic-sparkles text-xs"></i> Websites
          </button>
          <button onclick="window.nexusApp.navigate('chat')" class="nav-link-btn ${activeView === 'chat' ? 'active' : ''}">
            <i class="fa-solid fa-comments text-xs"></i> AI Chat
          </button>
          <button onclick="window.nexusApp.navigate('portfolio')" class="nav-link-btn ${activeView === 'portfolio' ? 'active' : ''}">
            <i class="fa-solid fa-palette text-xs"></i> Portfolios
          </button>
          <button onclick="window.nexusApp.navigate('resume')" class="nav-link-btn ${activeView === 'resume' ? 'active' : ''}">
            <i class="fa-solid fa-file-invoice text-xs"></i> Resumes
          </button>
          <button onclick="window.nexusApp.navigate('rag')" class="nav-link-btn ${activeView === 'rag' ? 'active' : ''}">
            <i class="fa-solid fa-brain text-xs"></i> RAG Base
          </button>
          <button onclick="window.nexusApp.navigate('workspace')" class="nav-link-btn ${activeView === 'workspace' ? 'active' : ''}">
            <i class="fa-solid fa-folder-open text-xs"></i> Workspace
          </button>
          <button onclick="window.nexusApp.navigate('dashboard')" class="nav-link-btn ${activeView === 'dashboard' ? 'active' : ''}">
            <i class="fa-solid fa-chart-line text-xs"></i> Dashboard
          </button>
          ${(user.role === 'admin' || user.role === 'superadmin') ? `
            <button onclick="window.nexusApp.navigate('admin')" class="nav-link-btn ${activeView === 'admin' ? 'active' : ''} text-rose-400">
              <i class="fa-solid fa-shield-halved text-xs"></i> Admin
            </button>
          ` : ''}
        </div>

        <!-- Right User Actions -->
        <div class="flex items-center gap-3">
          <button onclick="window.nexusApp.openCommandPalette()" title="Search & Actions (Ctrl+K)" class="hidden md:flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-400 px-3 py-1.5 rounded-lg text-xs hover:border-gray-600 transition">
            <i class="fa-solid fa-magnifying-glass text-[10px]"></i> Quick Find <kbd class="bg-gray-800 text-gray-300 px-1 py-0.5 rounded text-[10px] font-mono">⌘K</kbd>
          </button>

          <div onclick="window.nexusApp.navigate('profile')" class="flex items-center gap-2.5 cursor-pointer p-1 rounded-full border border-gray-800 hover:border-cyan-400 transition bg-[#10141E]">
            <img class="w-7 h-7 rounded-full object-cover" src="${user.avatarUrl}" alt="Avatar">
            <span class="text-xs font-semibold text-gray-200 hidden lg:inline pr-2">${user.name}</span>
          </div>
        </div>
      </nav>
    `;
  },

  renderView() {
    const mainRoot = document.getElementById("main-view-container");
    if (!mainRoot) return;

    let html = "";
    let moduleRef = null;

    switch (this.currentView) {
      case "landing":
        html = window.NexusLandingModule.render();
        moduleRef = window.NexusLandingModule;
        break;
      case "chat":
        html = window.NexusChatModule.render();
        moduleRef = window.NexusChatModule;
        break;
      case "website":
        html = window.NexusWebsiteGeneratorModule.render();
        moduleRef = window.NexusWebsiteGeneratorModule;
        break;
      case "portfolio":
        html = window.NexusPortfolioModule.render();
        moduleRef = window.NexusPortfolioModule;
        break;
      case "resume":
        html = window.NexusResumeModule.render();
        moduleRef = window.NexusResumeModule;
        break;
      case "rag":
        html = window.NexusRAGModule.render();
        moduleRef = window.NexusRAGModule;
        break;
      case "workspace":
        html = window.NexusWorkspaceModule.render();
        moduleRef = window.NexusWorkspaceModule;
        break;
      case "dashboard":
        html = window.NexusDashboardModule.render();
        moduleRef = window.NexusDashboardModule;
        break;
      case "admin":
        html = window.NexusAdminModule.render();
        moduleRef = window.NexusAdminModule;
        break;
      case "profile":
        html = window.NexusAuthModule.renderProfile();
        moduleRef = window.NexusAuthModule;
        break;
      default:
        html = window.NexusLandingModule.render();
        moduleRef = window.NexusLandingModule;
    }

    mainRoot.innerHTML = html;
    if (moduleRef && moduleRef.init) {
      setTimeout(() => moduleRef.init(), 50);
    }
  },

  showToast(message, type = "info") {
    const existing = document.querySelector(".nexus-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "nexus-toast";
    toast.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
      <span class="text-xs font-semibold text-white">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  openCommandPalette() {
    const modalContainer = document.getElementById("global-modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="nexus-modal-overlay" onclick="if(event.target === this) window.nexusApp.closeModal()">
        <div class="nexus-modal-content p-4 max-w-lg">
          <div class="flex items-center gap-3 border-b border-gray-800 pb-3 mb-3">
            <i class="fa-solid fa-magnifying-glass text-gray-500 text-sm"></i>
            <input id="cmd-input" type="text" placeholder="Type a command or jump to module..." class="w-full bg-transparent text-white text-sm outline-none">
            <kbd class="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
          </div>

          <div class="space-y-1 text-xs text-gray-300 max-h-64 overflow-y-auto">
            <div onclick="window.nexusApp.navigate('website'); window.nexusApp.closeModal();" class="p-2 rounded hover:bg-gray-900 cursor-pointer flex items-center justify-between">
              <span>⚡ Generate New Website</span>
              <span class="text-gray-500">Module 3</span>
            </div>
            <div onclick="window.nexusApp.navigate('chat'); window.nexusApp.closeModal();" class="p-2 rounded hover:bg-gray-900 cursor-pointer flex items-center justify-between">
              <span>💬 Open AI Conversational Assistant</span>
              <span class="text-gray-500">Module 2</span>
            </div>
            <div onclick="window.nexusApp.navigate('resume'); window.nexusApp.closeModal();" class="p-2 rounded hover:bg-gray-900 cursor-pointer flex items-center justify-between">
              <span>📄 Scan Resume & ATS Score</span>
              <span class="text-gray-500">Module 5</span>
            </div>
            <div onclick="window.nexusApp.navigate('portfolio'); window.nexusApp.closeModal();" class="p-2 rounded hover:bg-gray-900 cursor-pointer flex items-center justify-between">
              <span>🎨 Deploy AI Portfolio</span>
              <span class="text-gray-500">Module 4</span>
            </div>
            <div onclick="window.nexusApp.navigate('rag'); window.nexusApp.closeModal();" class="p-2 rounded hover:bg-gray-900 cursor-pointer flex items-center justify-between">
              <span>📚 Query RAG Knowledge Base</span>
              <span class="text-gray-500">Module 6</span>
            </div>
            <div onclick="window.nexusApp.navigate('dashboard'); window.nexusApp.closeModal();" class="p-2 rounded hover:bg-gray-900 cursor-pointer flex items-center justify-between">
              <span>📊 View Analytics & Tokens</span>
              <span class="text-gray-500">Module 8</span>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const input = document.getElementById("cmd-input");
      if (input) input.focus();
    }, 50);
  },

  closeModal() {
    const modalContainer = document.getElementById("global-modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
  }
};

// Auto-run on document ready
document.addEventListener("DOMContentLoaded", () => {
  window.nexusApp.init();
});
