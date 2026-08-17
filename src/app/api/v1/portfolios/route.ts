import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, title, bio, theme = "CYBER", skills = [], projects = [], experience = [], subdomain } = body;

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        type: "PORTFOLIO",
        title: `${name}'s Professional Portfolio`,
        portfolio: {
          create: {
            theme,
            content: { name, title, bio, skills, projects, experience },
            subdomain: subdomain || `${name.toLowerCase().replace(/\s+/g, '')}.nexus.site`,
            deploymentUrl: `https://${subdomain || `${name.toLowerCase().replace(/\s+/g, '')}.nexus.site`}`,
          },
        },
      },
      include: { portfolio: true },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
