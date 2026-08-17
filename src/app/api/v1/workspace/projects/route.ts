import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
        type: type ? (type.toUpperCase() as any) : undefined,
        deletedAt: null,
      },
      include: {
        generatedWebsite: true,
        portfolio: true,
        resumeAnalysis: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
