/**
 * NEXUS AI — Production Website Generator Service
 */

import { generateGeminiResponse, GeminiChatMessage } from "./gemini";

export interface WebsiteGenerationResult {
  title: string;
  category: string;
  prompt: string;
  techStack: { framework: string; responsive: boolean; animations: string; js: string };
  files: Record<string, string>;
}

export async function generateFullStackWebsite(prompt: string): Promise<WebsiteGenerationResult> {
  let title = "Generated Website";
  let category = "General";
  let htmlContent = "";

  try {
    const geminiPrompt: GeminiChatMessage[] = [
      {
        role: "user",
        content: `You are an expert full-stack web developer. Generate a complete, production-ready HTML5 website based on this prompt: "${prompt}"

Requirements:
- Use Tailwind CSS via CDN for styling
- Include responsive design (mobile-first)
- Use modern, clean UI with good contrast
- Include a navigation bar, hero section, and at least 2 content sections
- Use semantic HTML5 elements
- Include appropriate meta tags
- Make it visually appealing with a modern dark theme
- Ensure all inline styles and scripts work properly

Provide your response as a complete HTML document in a code block. Do not include any explanation outside the code block. The HTML should be ready to run immediately.`
      }
    ];

    const response = await generateGeminiResponse(geminiPrompt);
    
    // Extract HTML from code block
    const codeBlockMatch = response.text.match(/```html\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      htmlContent = codeBlockMatch[1];
    } else {
      // Fallback: try to extract any HTML-like content
      const htmlMatch = response.text.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
      htmlContent = htmlMatch ? htmlMatch[0] : response.text;
    }

    // Extract title from HTML or generate one
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    title = titleMatch ? titleMatch[1] : "Generated Website";

    // Determine category based on prompt
    const p = prompt.toLowerCase();
    if (p.includes("gym") || p.includes("fitness")) category = "Fitness & Wellness";
    else if (p.includes("crypto") || p.includes("defi") || p.includes("web3")) category = "Web3 & DeFi";
    else if (p.includes("saas") || p.includes("analytics") || p.includes("dashboard")) category = "SaaS & Cloud";
    else if (p.includes("ecommerce") || p.includes("shop") || p.includes("store")) category = "E-Commerce";
    else if (p.includes("portfolio") || p.includes("personal")) category = "Portfolio";
    else category = "General";

  } catch (error) {
    console.error("Gemini website generation failed, using fallback:", error);
    
    // Fallback templates based on prompt keywords
    const p = prompt.toLowerCase();
    
    if (p.includes("gym") || p.includes("fitness")) {
      title = "Apex Cyber Fitness & High-Performance Club";
      category = "Fitness & Wellness";
      htmlContent = `<!DOCTYPE html>
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
      <a href="#trainers" class="hover:text-cyan-400">Trainers</a>
      <a href="#passes" class="hover:text-cyan-400">Passes</a>
    </div>
    <button class="bg-cyan-400 text-black px-5 py-2 rounded-md font-bold text-sm">Book Session</button>
  </nav>
  <header class="py-24 px-6 text-center max-w-4xl mx-auto">
    <h1 class="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">Science-Backed <br><span class="text-cyan-400">Hypertrophy & Conditioning</span></h1>
    <p class="text-zinc-400 text-lg mb-8">Bio-metric tracked resistance training and cryotherapy chambers.</p>
    <button class="bg-cyan-400 text-black font-bold px-8 py-3 rounded-lg">Claim 3-Day VIP Pass</button>
  </header>
</body>
</html>`;
    } else if (p.includes("crypto") || p.includes("defi") || p.includes("web3")) {
      title = "NovaDEX — Decentralized Liquidity Engine";
      category = "Web3 & DeFi";
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaDEX // Sub-Second Liquidity & Swap</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background: #06070B; color: #F3F4F6; }</style>
</head>
<body class="bg-[#06070B] min-h-screen">
  <nav class="p-6 flex justify-between items-center border-b border-gray-800 backdrop-blur sticky top-0 z-50">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-black">◆</div>
      <span class="text-xl font-black">Nova<span class="text-cyan-400">DEX</span></span>
    </div>
    <button class="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-5 py-2 rounded-lg font-bold text-xs">Connect Wallet</button>
  </nav>
  <main class="max-w-5xl mx-auto px-6 py-20 text-center">
    <h1 class="text-5xl font-black mb-6">Trade Crypto with <span class="text-cyan-400">Zero Slippage</span></h1>
    <p class="text-gray-400 text-sm max-w-xl mx-auto mb-10">Deep aggregated liquidity across 14 EVM chains with automated MEV protection.</p>
  </main>
</body>
</html>`;
    } else {
      title = "NexusFlow — Modern AI Analytics Platform";
      category = "SaaS & Cloud";
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusFlow — Autonomous AI Telemetry</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #08090D; color: #F3F4F6; }
    .gradient-text { background: linear-gradient(135deg, #00F0FF 0%, #3B82F6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body>
  <nav class="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-lg">⚡</div>
      <span class="text-xl font-bold">NexusFlow</span>
    </div>
    <button class="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold px-5 py-2 rounded-lg text-sm">Get Started</button>
  </nav>
  <header class="py-20 px-6 max-w-4xl mx-auto text-center">
    <h1 class="text-6xl font-extrabold mb-6">Observe & Optimize <br><span class="gradient-text">Autonomous AI Agents</span></h1>
    <p class="text-gray-400 text-lg mb-8">Reduce latency and eliminate LLM hallucinations in real-time.</p>
    <button class="bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl">Start Free Trial</button>
  </header>
</body>
</html>`;
    }
  }

  return {
    title,
    category,
    prompt,
    techStack: { 
      framework: "Tailwind CSS + HTML5", 
      responsive: true, 
      animations: "CSS Transitions", 
      js: "Vanilla JS" 
    },
    files: {
      "index.html": htmlContent,
    },
  };
}
