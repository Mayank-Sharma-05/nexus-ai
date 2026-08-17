import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { analyzeResumeContent } from "@/lib/ai/resumeAnalyzer";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText) {
      return NextResponse.json({ success: false, error: "Resume content is required" }, { status: 400 });
    }

    // 1. Run deterministic ATS scoring engine
    const analysis = await analyzeResumeContent(resumeText, jobDescription);

    // 2. Persist in database
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        type: "RESUME_REPORT",
        title: `Resume ATS Scan (${new Date().toLocaleDateString()})`,
        resumeAnalysis: {
          create: {
            jobDescription,
            atsScore: analysis.atsScore,
            subScores: analysis.subScores,
            matchedKeywords: analysis.matchedKeywords,
            missingKeywords: analysis.missingKeywords,
            suggestions: analysis.suggestions,
          },
        },
      },
      include: {
        resumeAnalysis: true,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
