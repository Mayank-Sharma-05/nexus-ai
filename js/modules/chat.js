/**
 * NEXUS AI — Module 2: AI Chat Assistant
 * ChatGPT/Claude-style conversational AI with token streaming, code syntax copy,
 * thread search, file attachments, and AI intent routing cards.
 */

window.NexusChatModule = {
  render() {
    const chats = window.nexusStore.get("chats") || [];
    const activeChatId = window.nexusStore.get("activeChatId") || (chats[0] ? chats[0].id : null);
    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
    const activeModel = window.nexusStore.get("activeModel") || "nexus-pro";

    return `
      <div class="chat-container">
        <!-- Chat History Sidebar -->
        <aside class="chat-sidebar">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Conversations</span>
            <button onclick="window.NexusChatModule.createNewChat()" class="btn-electric text-xs py-1.5 px-3">
              <i class="fa-solid fa-plus"></i> New Chat
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <input id="chat-search-input" oninput="window.NexusChatModule.filterChats(this.value)" type="text" placeholder="Search conversations..." class="nexus-input text-xs py-2 pl-8">
            <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-500 text-xs"></i>
          </div>

          <!-- Threads List -->
          <div id="chat-thread-list" class="chat-thread-list">
            ${chats.map(chat => `
              <div onclick="window.NexusChatModule.selectChat('${chat.id}')" class="chat-thread-item ${chat.id === activeChatId ? 'active' : ''}">
                <div class="flex items-center gap-2 truncate">
                  <i class="fa-regular fa-message text-xs ${chat.pinned ? 'text-cyan-400' : 'text-gray-500'}"></i>
                  <span class="truncate">${chat.title}</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 hover:opacity-100 group-hover:opacity-100">
                  <button onclick="event.stopPropagation(); window.NexusChatModule.togglePinChat('${chat.id}')" title="Pin chat" class="text-gray-500 hover:text-cyan-400 text-xs p-1">
                    <i class="fa-solid fa-thumbtack ${chat.pinned ? 'text-cyan-400' : ''}"></i>
                  </button>
                  <button onclick="event.stopPropagation(); window.NexusChatModule.deleteChat('${chat.id}')" title="Delete chat" class="text-gray-500 hover:text-rose-400 text-xs p-1">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Model & Speed Selector + Voice Mode -->
          <div class="pt-3 border-t border-gray-800/80 space-y-2">
            <div class="flex items-center justify-between text-[11px] text-gray-400">
              <span>Model Engine:</span>
              <select onchange="window.nexusStore.set('activeModel', this.value)" class="bg-[#121622] border border-gray-800 text-cyan-400 rounded px-1.5 py-0.5 text-[11px]">
                ${window.NEXUS_CONFIG.API_MODELS.map(m => `
                  <option value="${m.id}" ${m.id === activeModel ? 'selected' : ''}>${m.name}</option>
                `).join("")}
              </select>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-400">
              <span>Stream Speed:</span>
              <div class="flex gap-1">
                <button onclick="window.nexusStore.set('streamingSpeed', 'instant'); window.nexusApp.renderView();" class="px-1.5 py-0.5 rounded text-[10px] ${window.nexusStore.get('streamingSpeed') === 'instant' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-gray-500'}">Instant</button>
                <button onclick="window.nexusStore.set('streamingSpeed', 'fast'); window.nexusApp.renderView();" class="px-1.5 py-0.5 rounded text-[10px] ${window.nexusStore.get('streamingSpeed') === 'fast' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-gray-500'}">Fast</button>
              </div>
            </div>
            <div class="pt-1">
              <button onclick="window.NexusChatModule.toggleVoiceMode()" id="voice-mode-btn" class="w-full py-2 px-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-cyan-400 text-xs text-gray-300 flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-microphone text-cyan-400"></i> Toggle Live Voice Mode
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Chat Area -->
        <main class="chat-main-area">
          <!-- Active Chat Header -->
          <div class="border-b border-gray-800 px-6 py-3.5 flex items-center justify-between bg-[#0B0E14]/70 backdrop-blur">
            <div class="flex items-center gap-3">
              <h2 id="active-chat-title" class="font-bold text-white text-base">${activeChat ? activeChat.title : 'New Chat'}</h2>
              <span class="badge-pill text-[10px]"><i class="fa-solid fa-bolt text-cyan-400"></i> ${window.NEXUS_CONFIG.API_MODELS.find(m => m.id === activeModel)?.name || 'Nexus Ultra'}</span>
            </div>
            <div class="flex gap-2">
              <button onclick="window.NexusChatModule.renameCurrentChat()" title="Rename Chat" class="btn-ghost text-xs">
                <i class="fa-solid fa-pen"></i> Rename
              </button>
              <button onclick="window.NexusChatModule.clearCurrentMessages()" title="Clear Messages" class="btn-ghost text-xs text-rose-400 hover:text-rose-300">
                <i class="fa-solid fa-broom"></i> Clear
              </button>
            </div>
          </div>

          <!-- Messages Scroll View -->
          <div id="chat-messages-container" class="chat-messages-scroll">
            ${activeChat && activeChat.messages ? activeChat.messages.map(msg => this.renderMessageHTML(msg)).join("") : ''}
          </div>

          <!-- Input Box Bar -->
          <div class="p-4 sm:p-6 border-t border-gray-800 bg-[#08090C]/90">
            <div class="max-w-4xl mx-auto relative">
              <div class="glass-panel p-2 flex flex-col gap-2 border border-gray-800 focus-within:border-cyan-400 transition shadow-xl">
                <textarea id="chat-user-input" rows="2" placeholder="Ask Nexus AI anything, or say 'Build a gym website', 'Analyze my resume'..." class="w-full bg-transparent text-white text-sm outline-none px-3 py-2 resize-none font-sans" onkeydown="if(event.key === 'Enter' && !event.shiftKey){ event.preventDefault(); window.NexusChatModule.sendMessage(); }"></textarea>

                <div class="flex items-center justify-between pt-2 border-t border-gray-800/80 px-2">
                  <div class="flex items-center gap-2">
                    <label class="cursor-pointer text-gray-400 hover:text-cyan-400 text-xs flex items-center gap-1.5 px-2 py-1 rounded bg-gray-900 border border-gray-800">
                      <i class="fa-solid fa-paperclip"></i> Attach Document / PDF
                      <input type="file" onchange="window.NexusChatModule.handleAttachment(event)" class="hidden" accept=".pdf,.docx,.txt,.csv">
                    </label>
                    <span id="chat-attachment-tag" class="hidden text-xs text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded flex items-center gap-1"></span>
                  </div>

                  <button onclick="window.NexusChatModule.sendMessage()" id="chat-send-btn" class="btn-electric text-xs py-2 px-5">
                    Send <i class="fa-solid fa-arrow-up"></i>
                  </button>
                </div>
              </div>
              <div class="text-[11px] text-gray-500 text-center mt-2">
                Nexus AI can make errors. Verify important code and architecture plans.
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  init() {
    this.scrollToBottom();
  },

  renderMessageHTML(msg) {
    const isAssistant = msg.role === "assistant";
    const renderedContent = this.formatMarkdown(msg.content);

    return `
      <div class="flex gap-4 ${isAssistant ? '' : 'justify-end'}">
        ${isAssistant ? `
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-xs shadow-md flex-shrink-0">
            ⚡
          </div>
        ` : ''}

        <div class="chat-bubble ${isAssistant ? 'chat-bubble-assistant' : 'chat-bubble-user'}">
          <div class="prose prose-invert max-w-none text-sm leading-relaxed">${renderedContent}</div>

          ${msg.routerSuggestion ? `
            <div class="ai-router-card">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-sm">
                  <i class="fa-solid fa-compass"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">${msg.routerSuggestion.title}</div>
                  <div class="text-[11px] text-gray-400">${msg.routerSuggestion.prompt}</div>
                </div>
              </div>
              <button onclick="window.NexusChatModule.handleRouterAction('${msg.routerSuggestion.type}', '${encodeURIComponent(msg.routerSuggestion.prompt)}')" class="btn-electric text-xs py-1.5 px-3">
                Launch →
              </button>
            </div>
          ` : ''}
        </div>

        ${!isAssistant ? `
          <div class="w-8 h-8 rounded-lg bg-[#1F293D] border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
            U
          </div>
        ` : ''}
      </div>
    `;
  },

  formatMarkdown(text) {
    if (!text) return "";

    // 1. Format code blocks
    let formatted = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const codeId = "code-" + Math.random().toString(36).substr(2, 9);
      const safeCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `
        <div class="code-block-wrapper">
          <div class="code-header">
            <span class="font-mono text-cyan-400 uppercase font-semibold">${lang || 'plaintext'}</span>
            <button onclick="window.NexusChatModule.copyCode('${codeId}')" class="copy-code-btn" id="btn-${codeId}">
              <i class="fa-regular fa-copy"></i> Copy Code
            </button>
          </div>
          <pre class="code-content"><code id="${codeId}">${safeCode}</code></pre>
        </div>
      `;
    });

    // 2. Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    
    // 3. Headings
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-cyan-400 mt-4 mb-2">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>');

    // 4. Line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
  },

  copyCode(codeId) {
    const codeEl = document.getElementById(codeId);
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText);
    const btn = document.getElementById("btn-" + codeId);
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Code';
      }, 2000);
    }
  },

  async sendMessage() {
    const input = document.getElementById("chat-user-input");
    const content = input.value.trim();
    if (!content) return;

    input.value = "";
    const activeChatId = window.nexusStore.get("activeChatId");
    let chats = window.nexusStore.get("chats") || [];
    let chat = chats.find(c => c.id === activeChatId);

    if (!chat) {
      chat = { id: "chat-" + Date.now(), title: content.substring(0, 30), messages: [] };
      chats.unshift(chat);
      window.nexusStore.set("activeChatId", chat.id);
    }

    const userMsg = { id: "msg-" + Date.now(), role: "user", content, createdAt: new Date().toISOString() };
    chat.messages.push(userMsg);
    window.nexusStore.set("chats", chats);

    // Update tokens & analytics
    const user = window.nexusStore.get("user");
    window.nexusStore.set("user.tokensConsumed", user.tokensConsumed + Math.floor(content.length / 3) + 40);

    // Render user message immediately
    const container = document.getElementById("chat-messages-container");
    if (container) {
      container.innerHTML += this.renderMessageHTML(userMsg);
      this.scrollToBottom();
    }

    // AI Intent Classification
    const routerResult = window.NexusAIRouter.classifyIntent(content);

    // Prepare Assistant response
    let assistantReply = "";
    let routerSuggestion = null;

    if (routerResult.intent === "website") {
      assistantReply = `I've analyzed your prompt for website generation: **"${content}"**.\n\nI can scaffold a complete responsive full-stack web application with instant live sandboxed preview, multi-file code editor, and downloadable source ZIP.`;
      routerSuggestion = {
        type: "website",
        title: "Open in Website Generator Sandbox",
        prompt: content
      };
    } else if (routerResult.intent === "resume") {
      assistantReply = `I detected a resume & ATS optimization request.\n\nI can parse your resume, compare it against target job descriptions, compute your deterministic ATS score (0–100), and suggest impactful bullet point rewrites.`;
      routerSuggestion = {
        type: "resume",
        title: "Analyze in Resume ATS Optimizer",
        prompt: content
      };
    } else if (routerResult.intent === "portfolio") {
      assistantReply = `Ready to build your personal developer portfolio! You can choose between 5 distinct themes (*Minimalist*, *Cyber*, *Terminal*, *Studio*, *Startup Founder*) and publish to a live subdomain.`;
      routerSuggestion = {
        type: "portfolio",
        title: "Open AI Portfolio Builder",
        prompt: content
      };
    } else if (routerResult.intent === "rag") {
      assistantReply = `According to your indexed knowledge base documents (e.g. \`Nexus_AI_Architecture_Spec.pdf\`), RAG retrieval utilizes cosine similarity with a pgvector HNSW index. All citations are verifiable against source document chunks.`;
      routerSuggestion = {
        type: "rag",
        title: "Explore RAG Knowledge Base",
        prompt: content
      };
    } else {
      assistantReply = `Here is a detailed breakdown for **"${content}"**:\n\n### Architectural Insights\n- **Scalability**: Decouple compute and storage using serverless worker tiers.\n- **Performance**: Employ client-side hydration and sub-millisecond edge caching.\n- **Security**: Strict Pydantic token parsing and zero-trust API gateways.\n\n\`\`\`typescript\n// Example TypeScript Implementation\nexport interface AgentTask {\n  id: string;\n  status: 'idle' | 'running' | 'completed';\n  payload: Record<string, unknown>;\n}\n\`\`\`\n\nLet me know if you would like me to scaffold this into a full application!`;
    }

    // Stream the assistant reply
    const assistantMsgId = "msg-" + Date.now();
    const assistantMsg = {
      id: assistantMsgId,
      role: "assistant",
      content: assistantReply,
      routerSuggestion,
      createdAt: new Date().toISOString()
    };

    chat.messages.push(assistantMsg);
    window.nexusStore.set("chats", chats);

    if (container) {
      container.innerHTML += this.renderMessageHTML(assistantMsg);
      this.scrollToBottom();
    }
  },

  handleRouterAction(type, promptEncoded) {
    const prompt = decodeURIComponent(promptEncoded);
    if (type === "website") {
      window.nexusApp.navigate("website");
      setTimeout(() => {
        const input = document.getElementById("website-prompt-input");
        if (input) input.value = prompt;
      }, 100);
    } else if (type === "resume") {
      window.nexusApp.navigate("resume");
    } else if (type === "portfolio") {
      window.nexusApp.navigate("portfolio");
    } else if (type === "rag") {
      window.nexusApp.navigate("rag");
    }
  },

  handleAttachment(event) {
    const file = event.target.files[0];
    if (!file) return;
    const tag = document.getElementById("chat-attachment-tag");
    if (tag) {
      tag.classList.remove("hidden");
      tag.innerHTML = `<i class="fa-solid fa-file-pdf"></i> ${file.name} <button onclick="this.parentElement.classList.add('hidden')" class="hover:text-white">✕</button>`;
      window.nexusApp.showToast(`✓ Attached ${file.name} for RAG extraction`);
    }
  },

  createNewChat() {
    const newChat = {
      id: "chat-" + Date.now(),
      title: "New Conversation",
      messages: [],
      updatedAt: new Date().toISOString()
    };
    const chats = [newChat, ...(window.nexusStore.get("chats") || [])];
    window.nexusStore.set("chats", chats);
    window.nexusStore.set("activeChatId", newChat.id);
    window.nexusApp.renderView();
  },

  selectChat(id) {
    window.nexusStore.set("activeChatId", id);
    window.nexusApp.renderView();
  },

  togglePinChat(id) {
    let chats = window.nexusStore.get("chats") || [];
    chats = chats.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c);
    window.nexusStore.set("chats", chats);
    window.nexusApp.renderView();
  },

  deleteChat(id) {
    let chats = window.nexusStore.get("chats") || [];
    chats = chats.filter(c => c.id !== id);
    window.nexusStore.set("chats", chats);
    if (window.nexusStore.get("activeChatId") === id) {
      window.nexusStore.set("activeChatId", chats[0] ? chats[0].id : null);
    }
    window.nexusApp.renderView();
    window.nexusApp.showToast("Conversation deleted");
  },

  renameCurrentChat() {
    const activeChatId = window.nexusStore.get("activeChatId");
    let chats = window.nexusStore.get("chats") || [];
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    const newTitle = prompt("Enter new conversation title:", chat.title);
    if (newTitle && newTitle.trim()) {
      chat.title = newTitle.trim();
      window.nexusStore.set("chats", chats);
      window.nexusApp.renderView();
    }
  },

  clearCurrentMessages() {
    const activeChatId = window.nexusStore.get("activeChatId");
    let chats = window.nexusStore.get("chats") || [];
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    if (confirm("Clear all messages in this chat?")) {
      chat.messages = [];
      window.nexusStore.set("chats", chats);
      window.nexusApp.renderView();
    }
  },

  scrollToBottom() {
    const container = document.getElementById("chat-messages-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  toggleVoiceMode() {
    const modalContainer = document.getElementById("global-modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="nexus-modal-overlay" onclick="if(event.target === this) window.NexusChatModule.closeVoiceModal()">
        <div class="nexus-modal-content p-8 max-w-md text-center space-y-6">
          <div class="flex justify-between items-center">
            <span class="badge-pill"><i class="fa-solid fa-microphone-lines text-cyan-400"></i> Nexus Voice Link</span>
            <button onclick="window.NexusChatModule.closeVoiceModal()" class="text-gray-400 hover:text-white">✕</button>
          </div>

          <!-- Live Audio Visualizer Canvas -->
          <div class="py-4 flex flex-col items-center">
            <div class="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border-2 border-cyan-400 flex items-center justify-center animate-pulse-glow shadow-2xl relative">
              <i class="fa-solid fa-waveform-lines text-4xl text-cyan-300"></i>
              <div class="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping"></div>
            </div>
            <div id="voice-status-text" class="text-sm font-semibold text-white mt-6">Listening for speech...</div>
            <div class="text-xs text-gray-400 mt-1">Speak naturally to converse with Nexus Ultra</div>
          </div>

          <div class="flex justify-center gap-3">
            <button onclick="window.NexusChatModule.simulateVoiceInput('Build an AI landing page with dark luxury theme')" class="btn-secondary text-xs">
              "Build an AI landing page"
            </button>
            <button onclick="window.NexusChatModule.simulateVoiceInput('What is pgvector HNSW indexing?')" class="btn-secondary text-xs">
              "Explain pgvector"
            </button>
          </div>

          <div class="pt-4 border-t border-gray-800">
            <button onclick="window.NexusChatModule.closeVoiceModal()" class="btn-ghost text-xs text-rose-400">
              End Voice Session
            </button>
          </div>
        </div>
      </div>
    `;

    // Try starting Web Speech API recognition if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        window.NexusChatModule.simulateVoiceInput(transcript);
      };
      try { recognition.start(); } catch(e) {}
    }
  },

  closeVoiceModal() {
    const modalContainer = document.getElementById("global-modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  },

  simulateVoiceInput(spokenText) {
    const statusText = document.getElementById("voice-status-text");
    if (statusText) statusText.innerText = `Recognized: "${spokenText}"... Thinking...`;

    setTimeout(() => {
      this.closeVoiceModal();
      const input = document.getElementById("chat-user-input");
      if (input) input.value = spokenText;
      this.sendMessage();

      // Read response aloud with Web Speech Synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("I've processed your request and generated the architectural breakdown.");
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }, 1200);
  }
};
