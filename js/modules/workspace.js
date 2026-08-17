/**
 * NEXUS AI — Module 7: Project Workspace
 * Unified library of all generated websites, portfolios, resume reports,
 * documents, and chats with duplicate, trash, restore, and export capabilities.
 */

window.NexusWorkspaceModule = {
  currentFilter: "all", // all | website | portfolio | resume | document
  searchQuery: "",

  render() {
    const websites = (window.nexusStore.get("websites") || []).map(w => ({ ...w, type: "website" }));
    const portfolios = (window.nexusStore.get("portfolios") || []).map(p => ({ ...p, type: "portfolio", title: `${p.name}'s Portfolio` }));
    const resumes = (window.nexusStore.get("resumes") || []).map(r => ({ ...r, type: "resume" }));
    const docs = (window.nexusStore.get("documents") || []).map(d => ({ ...d, type: "document", title: d.fileName }));
    const trash = window.nexusStore.get("trash") || [];

    let allItems = [...websites, ...portfolios, ...resumes, ...docs];

    // Filter by type
    if (this.currentFilter !== "all" && this.currentFilter !== "trash") {
      allItems = allItems.filter(item => item.type === this.currentFilter);
    } else if (this.currentFilter === "trash") {
      allItems = trash;
    }

    // Filter by search query
    if (this.searchQuery) {
      allItems = allItems.filter(item => (item.title || item.name || '').toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    return `
      <div class="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <span class="badge-pill mb-2"><i class="fa-solid fa-folder-open text-amber-400"></i> Module 7 — Workspace</span>
            <h1 class="text-3xl font-extrabold text-white">Central Project Workspace</h1>
            <p class="text-gray-400 text-sm">Unified library of all your generated sites, portfolios, resume scans, and knowledge bases.</p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="window.nexusApp.navigate('website')" class="btn-electric text-xs py-2 px-4">
              <i class="fa-solid fa-plus"></i> New Website
            </button>
            <button onclick="window.nexusApp.navigate('portfolio')" class="btn-secondary text-xs py-2 px-3">
              <i class="fa-solid fa-palette"></i> New Portfolio
            </button>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex gap-2">
            <button onclick="window.NexusWorkspaceModule.setFilter('all')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${this.currentFilter === 'all' ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">All Artifacts (${websites.length + portfolios.length + resumes.length + docs.length})</button>
            <button onclick="window.NexusWorkspaceModule.setFilter('website')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${this.currentFilter === 'website' ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">⚡ Websites (${websites.length})</button>
            <button onclick="window.NexusWorkspaceModule.setFilter('portfolio')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${this.currentFilter === 'portfolio' ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">🎨 Portfolios (${portfolios.length})</button>
            <button onclick="window.NexusWorkspaceModule.setFilter('resume')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${this.currentFilter === 'resume' ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">📄 Resumes (${resumes.length})</button>
            <button onclick="window.NexusWorkspaceModule.setFilter('document')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${this.currentFilter === 'document' ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300' : 'border-gray-800 bg-[#121622] text-gray-400'}">📚 RAG Docs (${docs.length})</button>
            <button onclick="window.NexusWorkspaceModule.setFilter('trash')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${this.currentFilter === 'trash' ? 'border-rose-400 bg-rose-950/60 text-rose-300' : 'border-gray-800 bg-[#121622] text-gray-400'}"><i class="fa-solid fa-trash-can"></i> Trash (${trash.length})</button>
          </div>

          <div class="relative w-72">
            <input type="text" oninput="window.NexusWorkspaceModule.search(this.value)" placeholder="Search projects by title..." class="nexus-input text-xs pl-8">
            <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-500 text-xs"></i>
          </div>
        </div>

        <!-- Project Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${allItems.length > 0 ? allItems.map(item => this.renderProjectCard(item)).join("") : `
            <div class="col-span-3 py-16 text-center glass-panel p-8">
              <i class="fa-solid fa-box-open text-gray-600 text-4xl mb-3"></i>
              <h3 class="text-base font-bold text-gray-300">No projects found</h3>
              <p class="text-xs text-gray-500 mt-1">Generate a website, portfolio, or resume report to populate your workspace.</p>
            </div>
          `}
        </div>
      </div>
    `;
  },

  init() {},

  renderProjectCard(item) {
    const isTrash = this.currentFilter === "trash";

    return `
      <div class="glass-panel p-5 flex flex-col justify-between space-y-4 border border-gray-800 hover:border-gray-700 transition">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="badge-pill text-[10px]">
              ${item.type === 'website' ? '⚡ Website' : item.type === 'portfolio' ? '🎨 Portfolio' : item.type === 'resume' ? '📄 ATS Resume' : '📚 RAG Doc'}
            </span>
            <span class="text-[11px] text-gray-500">${new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <h3 class="text-base font-bold text-white mb-1 line-clamp-1">${item.title || item.name || 'Untitled Project'}</h3>
          <p class="text-xs text-gray-400 line-clamp-2">${item.prompt || item.bio || item.category || 'Persistent autonomous artifact.'}</p>
        </div>

        <div class="pt-3 border-t border-gray-800 flex items-center justify-between">
          ${!isTrash ? `
            <div class="flex gap-2">
              <button onclick="window.NexusWorkspaceModule.openArtifact('${item.type}', '${item.id}')" class="btn-electric text-xs py-1 px-3">
                Open →
              </button>
              <button onclick="window.NexusWorkspaceModule.duplicateArtifact('${item.type}', '${item.id}')" title="Duplicate (Deep Copy)" class="btn-ghost text-xs p-1.5 text-gray-400 hover:text-white">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
            <button onclick="window.NexusWorkspaceModule.moveToTrash('${item.type}', '${item.id}')" title="Move to Trash" class="text-gray-500 hover:text-rose-400 text-xs p-1.5">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : `
            <button onclick="window.NexusWorkspaceModule.restoreFromTrash('${item.id}')" class="btn-electric text-xs py-1 px-3 bg-emerald-600 hover:bg-emerald-500">
              Restore Project
            </button>
            <button onclick="window.NexusWorkspaceModule.hardDelete('${item.id}')" class="text-xs text-rose-400 hover:underline">
              Delete Forever
            </button>
          `}
        </div>
      </div>
    `;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    window.nexusApp.renderView();
  },

  search(val) {
    this.searchQuery = val;
    window.nexusApp.renderView();
  },

  openArtifact(type, id) {
    if (type === "website") window.nexusApp.navigate("website");
    else if (type === "portfolio") window.nexusApp.navigate("portfolio");
    else if (type === "resume") window.nexusApp.navigate("resume");
    else if (type === "document") window.nexusApp.navigate("rag");
  },

  duplicateArtifact(type, id) {
    if (type === "website") {
      let websites = window.nexusStore.get("websites") || [];
      const item = websites.find(w => w.id === id);
      if (item) {
        const copy = { ...item, id: "proj-" + Date.now(), title: `${item.title} (Copy)`, createdAt: new Date().toISOString() };
        websites.unshift(copy);
        window.nexusStore.set("websites", websites);
        window.nexusApp.showToast("✓ Website duplicated independently!");
        window.nexusApp.renderView();
      }
    }
  },

  moveToTrash(type, id) {
    let websites = window.nexusStore.get("websites") || [];
    let trash = window.nexusStore.get("trash") || [];

    const item = websites.find(w => w.id === id);
    if (item) {
      websites = websites.filter(w => w.id !== id);
      trash.unshift({ ...item, deletedAt: new Date().toISOString() });
      window.nexusStore.set("websites", websites);
      window.nexusStore.set("trash", trash);
      window.nexusApp.showToast("Project moved to Trash (Recoverable for 30 days)");
      window.nexusApp.renderView();
    }
  },

  restoreFromTrash(id) {
    let trash = window.nexusStore.get("trash") || [];
    let websites = window.nexusStore.get("websites") || [];

    const item = trash.find(t => t.id === id);
    if (item) {
      trash = trash.filter(t => t.id !== id);
      websites.unshift(item);
      window.nexusStore.set("trash", trash);
      window.nexusStore.set("websites", websites);
      window.nexusApp.showToast("✓ Project restored to workspace!");
      window.nexusApp.renderView();
    }
  },

  hardDelete(id) {
    let trash = window.nexusStore.get("trash") || [];
    trash = trash.filter(t => t.id !== id);
    window.nexusStore.set("trash", trash);
    window.nexusApp.showToast("Project permanently deleted.");
    window.nexusApp.renderView();
  }
};
