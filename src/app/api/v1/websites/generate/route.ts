import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { generateFullStackWebsite } from "@/lib/ai/websiteGenerator";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    // 1. Generate full-stack codebase via AI engine
    const genResult = await generateFullStackWebsite(prompt);

    // 2. Persist Project & GeneratedWebsite in database
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        type: "WEBSITE",
        title: genResult.title,
        status: "active",
        generatedWebsite: {
          create: {
            prompt,
            techStack: genResult.techStack,
            files: genResult.files,
          },
        },
      },
      include: {
        generatedWebsite: true,
      },
    });

    // 3. Log API usage
    await prisma.apiUsageLog.create({
      data: {
        userId: user.id,
        module: "website",
        modelName: "nexus-ultra-3.7",
        inputTokens: Math.ceil(prompt.length / 4),
        outputTokens: 1850,
        costUsd: 0.045,
        latencyMs: 320,
        status: "success",
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
