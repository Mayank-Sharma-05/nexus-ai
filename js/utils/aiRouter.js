/**
 * NEXUS AI — AI Intent Router Engine
 * Automatically analyzes user queries to recommend specialized module pipelines
 * (e.g. Website Generator, Portfolio Builder, Resume Analyzer, or RAG Knowledge Base)
 */

window.NexusAIRouter = {
  classifyIntent(prompt) {
    const text = prompt.toLowerCase();

    // 1. Website Generation Intent
    if (text.includes("website") || text.includes("landing page") || text.includes("build a site") || text.includes("web app") || text.includes("create a page") || text.includes("gym website") || text.includes("restaurant website") || text.includes("saas")) {
      return {
        intent: "website",
        title: "Launch Website Generator",
        description: "Generate complete full-stack runnable code with live sandboxed preview and ZIP download.",
        actionLabel: "Open in Website Generator →",
        targetModule: "website",
        extractedPrompt: prompt
      };
    }

    // 2. Portfolio Builder Intent
    if (text.includes("portfolio") || text.includes("personal site") || text.includes("showcase my work") || text.includes("developer profile")) {
      return {
        intent: "portfolio",
        title: "Launch Portfolio Builder",
        description: "Create an interactive 5-theme portfolio with one-click subdomain deployment.",
        actionLabel: "Open in Portfolio Builder →",
        targetModule: "portfolio",
        extractedPrompt: prompt
      };
    }

    // 3. Resume Analyzer Intent
    if (text.includes("resume") || text.includes("cv") || text.includes("ats score") || text.includes("bullet points") || text.includes("job application") || text.includes("interview prep")) {
      return {
        intent: "resume",
        title: "Launch Resume Analyzer & ATS Optimizer",
        description: "Scan keyword gaps, compute deterministic ATS scores (0–100), and accept AI bullet rewrites.",
        actionLabel: "Open in Resume Analyzer →",
        targetModule: "resume",
        extractedPrompt: prompt
      };
    }

    // 4. Document / RAG Intent
    if (text.includes("document") || text.includes("pdf") || text.includes("spec") || text.includes("rag") || text.includes("knowledge base") || text.includes("architecture doc")) {
      return {
        intent: "rag",
        title: "Query RAG Knowledge Base",
        description: "Ask questions across your uploaded indexed PDFs and documents with grounded citations.",
        actionLabel: "Open RAG Knowledge Base →",
        targetModule: "rag",
        extractedPrompt: prompt
      };
    }

    // Default: General Chat
    return {
      intent: "general_chat",
      targetModule: "chat"
    };
  }
};
