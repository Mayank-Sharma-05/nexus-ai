/**
 * NEXUS AI — Production AI Intent Router
 * Classifies user chat prompts to route to specialized agents or provide direct actions.
 */

export interface ClassifiedIntent {
  intent: "website" | "portfolio" | "resume" | "rag" | "general_chat";
  title?: string;
  description?: string;
  actionUrl?: string;
  extractedPrompt?: string;
}

export function classifyUserPrompt(prompt: string): ClassifiedIntent {
  const text = prompt.toLowerCase();

  if (
    text.includes("website") ||
    text.includes("landing page") ||
    text.includes("build a site") ||
    text.includes("web app") ||
    text.includes("saas") ||
    text.includes("restaurant site") ||
    text.includes("gym site")
  ) {
    return {
      intent: "website",
      title: "Scaffold Full-Stack Website",
      description: "Generate runnable code with sandboxed preview and ZIP export.",
      actionUrl: "/websites",
      extractedPrompt: prompt,
    };
  }

  if (
    text.includes("portfolio") ||
    text.includes("personal site") ||
    text.includes("developer profile")
  ) {
    return {
      intent: "portfolio",
      title: "Deploy AI Portfolio",
      description: "Build an interactive 5-theme portfolio with 1-click subdomain deployment.",
      actionUrl: "/portfolios",
      extractedPrompt: prompt,
    };
  }

  if (
    text.includes("resume") ||
    text.includes("cv") ||
    text.includes("ats score") ||
    text.includes("bullet points")
  ) {
    return {
      intent: "resume",
      title: "Analyze Resume & ATS Score",
      description: "Deterministic ATS 0-100 scoring with keyword gap matrix & AI rewrites.",
      actionUrl: "/resumes",
      extractedPrompt: prompt,
    };
  }

  if (
    text.includes("document") ||
    text.includes("pdf") ||
    text.includes("knowledge base") ||
    text.includes("rag")
  ) {
    return {
      intent: "rag",
      title: "Query RAG Knowledge Base",
      description: "Semantic search across uploaded docs with verifiable source citations.",
      actionUrl: "/rag",
      extractedPrompt: prompt,
    };
  }

  return {
    intent: "general_chat",
  };
}
