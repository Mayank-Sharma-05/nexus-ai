import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_build", {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
});

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Starter Tier",
    price: 0,
    tokenAllowance: 50_000,
    features: [
      "Access to AI Chat Assistant",
      "Up to 3 Website Generations / mo",
      "1 AI Portfolio with Subdomain",
      "5 Resume ATS Scans",
      "10 MB Document RAG Storage"
    ],
  },
  PRO: {
    id: "pro",
    name: "Pro Creator",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_default",
    tokenAllowance: 5_000_000,
    features: [
      "Unlimited AI Chat with Gemini & Claude",
      "Unlimited Full-Stack Website Generation",
      "5 Live Portfolio Deployments + Custom Domains",
      "Unlimited ATS Resumes + AI Bullet Rewrites",
      "500 MB pgvector Knowledge Base Storage",
      "Priority p95 Latency Routing (<40ms)"
    ],
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise & Founders",
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_ent_default",
    tokenAllowance: 50_000_000,
    features: [
      "Dedicated High-Throughput VPC Cluster",
      "Unlimited Everything + White-label Export",
      "Custom Subdomains & SSL Certificates",
      "Team Shared Workspaces & Multi-User RBAC",
      "99.99% Guaranteed SLA",
      "24/7 Dedicated Solutions Engineer"
    ],
  },
};
