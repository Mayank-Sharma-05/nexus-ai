/**
 * NEXUS AI — Production TypeScript Definitions
 */

export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type SubscriptionTier = "FREE" | "PRO" | "ENTERPRISE";
export type PortfolioTheme = "MINIMAL" | "CYBER" | "TERMINAL" | "STUDIO" | "STARTUP";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  tokensConsumed: number;
  storageUsedBytes: number;
  tier: SubscriptionTier;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: Array<{ fileName: string; fileType: string; size: string }>;
  routerSuggestion?: {
    type: "website" | "portfolio" | "resume" | "rag";
    title: string;
    prompt: string;
  };
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  pinned: boolean;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface WebsiteProject {
  id: string;
  title: string;
  category: string;
  prompt: string;
  techStack: { framework: string; responsive: boolean; animations: string; js: string };
  files: Record<string, string>;
  deploymentUrl?: string;
  createdAt: string;
}

export interface PortfolioData {
  id: string;
  name: string;
  title: string;
  bio: string;
  theme: PortfolioTheme;
  skills: string[];
  projects: Array<{ name: string; desc: string; link: string }>;
  experience: Array<{ role: string; company: string; period: string }>;
  subdomain?: string;
  deployed: boolean;
}

export interface ResumeATSReport {
  id: string;
  name: string;
  role: string;
  atsScore: number;
  subScores: {
    keywords: number;
    impact: number;
    formatting: number;
    skills: number;
    structure: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Array<{
    id: string;
    section: string;
    type: string;
    current: string;
    improved: string;
    status: "pending" | "accepted" | "rejected";
  }>;
}

export interface RAGDocument {
  id: string;
  fileName: string;
  fileType: string;
  size: string;
  status: "ready" | "processing" | "failed";
  chunksCount: number;
  chunks: Array<{
    index: number;
    section: string;
    content: string;
    embeddingModel: string;
  }>;
}

export interface WorkspaceItem {
  id: string;
  type: "website" | "portfolio" | "resume" | "document" | "chat";
  title: string;
  description?: string;
  createdAt: string;
  status: string;
}

export interface AdminTelemetry {
  usersCount: number;
  totalTokens: number;
  monthlyCostUSD: number;
  avgLatencyMs: number;
  logsCount: number;
}
