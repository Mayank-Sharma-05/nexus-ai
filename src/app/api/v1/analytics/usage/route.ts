import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get total projects count
    const totalGenerations = await prisma.project.count({
      where: { userId: user.id, deletedAt: null },
    });

    // Get total tokens from API usage logs
    const usageLogs = await prisma.apiUsageLog.findMany({
      where: { userId: user.id },
    });

    const tokensStreamed = usageLogs.reduce((sum, log) => sum + log.inputTokens + log.outputTokens, 0);
    const costUsd = usageLogs.reduce((sum, log) => sum + Number(log.costUsd), 0);

    // Get storage usage from user record
    const storageUsed = Number(user.storageUsedBytes) || 0;
    const storageLimit = 500 * 1024 * 1024; // 500 MB

    // Generate daily velocity data (last 7 days)
    const dailyVelocity = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayLogs = usageLogs.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate.toDateString() === date.toDateString();
      });
      
      const dayTokens = dayLogs.reduce((sum, log) => sum + log.inputTokens + log.outputTokens, 0);
      dailyVelocity.push({ day: dayName, tokens: dayTokens });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalGenerations,
        tokensStreamed,
        storageUsed,
        storageLimit,
        costUsd,
        velocity: dailyVelocity,
      },
    });
  } catch (error: any) {
    console.error("Analytics fetch failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
