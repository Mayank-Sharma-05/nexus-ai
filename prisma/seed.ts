import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Nexus AI Production Database...");

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "alex.rivera@example.com" },
    update: {},
    create: {
      email: "alex.rivera@example.com",
      role: "ADMIN",
      emailVerified: true,
      status: "ACTIVE",
      tokensConsumed: 48920,
      profile: {
        create: {
          displayName: "Alex Rivera",
          bio: "Senior Full-Stack & AI Systems Architect.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          githubUrl: "https://github.com/alexrivera",
          linkedinUrl: "https://linkedin.com/in/alexrivera",
        },
      },
      settings: {
        create: {
          themePreference: "dark",
          notificationsEnabled: true,
          memoryEnabled: true,
        },
      },
      subscription: {
        create: {
          tier: "PRO",
          status: "ACTIVE",
        },
      },
    },
  });

  // 2. Create Initial Website Project
  await prisma.project.create({
    data: {
      userId: adminUser.id,
      type: "WEBSITE",
      title: "NexusFlow — Modern AI Analytics Platform",
      status: "active",
      generatedWebsite: {
        create: {
          prompt: "Create a modern dark-mode SaaS landing page for an AI observability platform",
          techStack: { framework: "Tailwind CSS + HTML5", responsive: true, animations: "CSS Keyframes", js: "Vanilla JS" },
          files: {
            "index.html": "<!DOCTYPE html><html><head><title>NexusFlow</title></head><body><h1>NexusFlow Observability</h1></body></html>",
          },
        },
      },
    },
  });

  // 3. Create Initial RAG Knowledge Base & Document
  await prisma.document.create({
    data: {
      userId: adminUser.id,
      fileName: "Nexus_AI_Architecture_Spec.pdf",
      fileType: "pdf",
      fileSizeBytes: 2400000,
      status: "ready",
      chunks: {
        create: [
          {
            chunkIndex: 1,
            content: "Nexus AI is an autonomous, all-in-one creation platform consolidating chat assistance, full-stack website generation, portfolio builder, resume ATS analyzer, and document RAG.",
          },
          {
            chunkIndex: 2,
            content: "Vector embeddings are indexed with pgvector HNSW cosine distance metric. Query retrieval employs top-k (k=5) with similarity threshold 0.72.",
          },
        ],
      },
    },
  });

  console.log("✅ Nexus AI Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
