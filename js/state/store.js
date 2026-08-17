/**
 * NEXUS AI — Central Reactive State Management Store
 * Handles automatic localStorage synchronization, event emitters, and persistent entities.
 */

class NexusStore {
  constructor() {
    this.storageKey = "NEXUS_AI_STATE_V1";
    this.listeners = new Map();
    this.state = this.loadState();
  }

  getInitialState() {
    return {
      // Module 1: Auth & User
      user: {
        id: "usr-" + Math.random().toString(36).substr(2, 9),
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        role: "admin", // Default 'admin' for demo testability; can switch to 'user' or 'superadmin'
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        bio: "Full-stack cloud architect & AI developer exploring autonomous agents.",
        githubUrl: "https://github.com/alexrivera",
        linkedinUrl: "https://linkedin.com/in/alexrivera",
        tokensConsumed: 48920,
        storageUsedMB: 18.4,
        storageQuotaMB: 500,
        createdAt: new Date().toISOString(),
        scheduledDeletionAt: null
      },
      currentView: "landing", // landing | chat | website | portfolio | resume | rag | workspace | dashboard | admin | profile
      activeModel: "nexus-pro",
      streamingSpeed: "fast", // fast | instant | normal

      // Module 2: AI Chat Threads
      chats: [
        {
          id: "chat-1",
          title: "Architecture breakdown for SaaS platform",
          pinned: true,
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          messages: [
            {
              id: "msg-1",
              role: "user",
              content: "Can you recommend the best tech stack and architecture for building a high-scale AI observability platform?",
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: "msg-2",
              role: "assistant",
              content: `For a modern, high-throughput AI observability platform, I recommend the following architecture:

### 1. Recommended Tech Stack
- **Frontend**: Next.js 15 App Router + Tailwind CSS + Framer Motion
- **Backend API**: FastAPI (Python 3.12) for high-performance async streaming
- **Database**: PostgreSQL with \`pgvector\` for semantic prompt deduplication
- **Message Broker**: Redis Pub/Sub for real-time telemetry streaming
- **AI Gateway**: Unified LLM proxy with fallback routes and token caching

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Nexus AI Observability Gateway")

class PromptTelemetry(BaseModel):
    session_id: str
    tokens_in: int
    tokens_out: int
    latency_ms: float

@app.post("/v1/telemetry")
async def record_telemetry(data: PromptTelemetry):
    # Log streaming token metrics to Redis time-series
    return {"status": "recorded", "latency": data.latency_ms}
\`\`\`

Would you like me to generate the full deployable code inside the **Website Generator**?`,
              routerSuggestion: {
                type: "website",
                title: "Generate Full-Stack SaaS Landing Site",
                prompt: "Create a modern dark-mode SaaS landing page for an AI observability platform"
              },
              createdAt: new Date(Date.now() - 3550000).toISOString()
            }
          ]
        }
      ],
      activeChatId: "chat-1",

      // Module 3: Websites
      websites: [
        {
          id: "proj-site-1",
          title: "NexusFlow — Modern AI Analytics Platform",
          category: "SaaS & Cloud",
          prompt: "Create a modern dark-mode SaaS landing page for an AI observability platform",
          files: window.NEXUS_CONFIG.WEBSITE_TEMPLATES.saas.files,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: "active"
        }
      ],
      currentWebsiteProject: null,

      // Module 4: Portfolios
      portfolios: [
        {
          id: "port-1",
          name: "Alex Rivera",
          title: "Senior Full-Stack & AI Systems Engineer",
          bio: "Building distributed cloud systems, real-time AI agents, and sub-millisecond semantic search architectures.",
          theme: "cyber", // minimal | cyber | terminal | studio | startup
          skills: ["TypeScript", "Python", "React / Next.js", "FastAPI", "PostgreSQL", "Docker", "pgvector", "AWS"],
          projects: [
            { name: "NexusFlow Observability", desc: "Autonomous AI latency and telemetry dashboard.", link: "https://github.com/alexrivera/nexusflow" },
            { name: "FastVector RAG Engine", desc: "Sub-millisecond document semantic retrieval engine in Go.", link: "https://github.com/alexrivera/fastvector" }
          ],
          experience: [
            { role: "Senior Software Engineer", company: "CloudScale Systems", period: "2022 - Present" },
            { role: "Software Engineer", company: "NextVenture Labs", period: "2019 - 2022" }
          ],
          subdomain: "alexrivera.nexus.site",
          deployed: true,
          updatedAt: new Date().toISOString()
        }
      ],

      // Module 5: Resumes
      resumes: [
        {
          id: "res-1",
          title: "Alex Rivera — Senior Full-Stack Engineer",
          score: 88,
          data: window.NEXUS_CONFIG.SAMPLE_RESUMES.swe,
          createdAt: new Date().toISOString()
        }
      ],

      // Module 6: RAG Documents
      documents: window.NEXUS_CONFIG.RAG_DOCUMENTS,

      // Module 7: Workspace Projects (Aggregated view)
      trash: [],

      // Module 8: Analytics Events & Metrics
      analytics: {
        dailyActivity: [
          { day: "Mon", chats: 12, websites: 2, resumes: 1, tokens: 14200 },
          { day: "Tue", chats: 19, websites: 4, resumes: 3, tokens: 28400 },
          { day: "Wed", chats: 25, websites: 1, resumes: 2, tokens: 32100 },
          { day: "Thu", chats: 32, websites: 5, resumes: 4, tokens: 49000 },
          { day: "Fri", chats: 28, websites: 3, resumes: 2, tokens: 38200 },
          { day: "Sat", chats: 15, websites: 1, resumes: 1, tokens: 19400 },
          { day: "Sun", chats: 22, websites: 4, resumes: 2, tokens: 26800 }
        ],
        totalGenerations: 142,
        tokensTotal: 208100,
        apiCostUSD: 4.18
      },

      // Module 9: Admin Logs & System Health
      admin: {
        users: [
          { id: "u-101", name: "Alex Rivera", email: "alex.rivera@example.com", role: "admin", status: "active", tokens: 48920, lastActive: "Just now" },
          { id: "u-102", name: "Samantha Chen", email: "samantha.c@enterprise.com", role: "user", status: "active", tokens: 82400, lastActive: "2 hrs ago" },
          { id: "u-103", name: "Dmitri Volkov", email: "dmitri.v@fintech.io", role: "user", status: "suspended", tokens: 195000, lastActive: "1 day ago" },
          { id: "u-104", name: "Sarah Jenkins", email: "sarah.j@startup.co", role: "user", status: "active", tokens: 23100, lastActive: "5 hrs ago" }
        ],
        auditLogs: [
          { id: "aud-1", action: "USER_ROLE_PROMOTION", actor: "system@nexus.ai", target: "alex.rivera@example.com", ip: "192.168.1.10", timestamp: new Date(Date.now() - 1200000).toISOString() },
          { id: "aud-2", action: "RATE_LIMIT_OVERRIDE", actor: "admin@nexus.ai", target: "samantha.c@enterprise.com", ip: "172.56.21.90", timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: "aud-3", action: "USER_SUSPENDED_ABUSE", actor: "security-bot@nexus.ai", target: "dmitri.v@fintech.io", ip: "45.134.20.1", timestamp: new Date(Date.now() - 86400000).toISOString() }
        ],
        systemLogs: [
          { id: "log-1", level: "INFO", module: "AI_ROUTER", message: "Successfully routed query to WebsiteGenerator (p95: 14ms)", timestamp: new Date().toISOString() },
          { id: "log-2", level: "INFO", module: "VECTOR_INDEX", message: "HNSW index refreshed on 13 vector chunks. Cosine recall 0.994", timestamp: new Date(Date.now() - 600000).toISOString() },
          { id: "log-3", level: "WARN", module: "AUTH_GATEWAY", message: "Suspicious login attempt blocked from ASN 49202 (Tor exit node)", timestamp: new Date(Date.now() - 3600000).toISOString() }
        ]
      }
    };
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not parse stored Nexus state; falling back to default.", e);
    }
    const initial = this.getInitialState();
    this.saveState(initial);
    return initial;
  }

  saveState(state = this.state) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save Nexus state to localStorage", e);
    }
  }

  get(path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], this.state);
  }

  set(path, value) {
    const parts = path.split('.');
    let curr = this.state;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]]) curr[parts[i]] = {};
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
    this.saveState();
    this.emit(parts[0], this.state[parts[0]]);
    this.emit("stateChange", { path, value, state: this.state });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(data); } catch (err) { console.error("Error in store listener", err); }
      });
    }
  }

  // Helper actions
  switchView(viewName) {
    this.set("currentView", viewName);
  }

  setUserRole(role) {
    const user = { ...this.state.user, role };
    this.set("user", user);
    this.addAuditLog("ROLE_SWITCH_DEBUG", user.email, `Role changed to ${role}`);
  }

  addAuditLog(action, target, note = "") {
    const log = {
      id: "aud-" + Date.now(),
      action,
      actor: this.state.user.email,
      target,
      ip: "127.0.0.1 (Local Session)",
      timestamp: new Date().toISOString()
    };
    const logs = [log, ...this.state.admin.auditLogs];
    this.set("admin.auditLogs", logs);
  }
}

window.nexusStore = new NexusStore();
