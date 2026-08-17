import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized admin access" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        profile: true,
        subscription: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Add token consumption data
    const usersWithTokens = await Promise.all(
      users.map(async (user) => {
        const usageLogs = await prisma.apiUsageLog.findMany({
          where: { userId: user.id },
        });
        const tokensConsumed = usageLogs.reduce((sum, log) => sum + log.inputTokens + log.outputTokens, 0);
        return {
          ...user,
          tokensConsumed,
        };
      })
    );

    return NextResponse.json({ success: true, data: usersWithTokens });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized admin access" }, { status: 403 });
    }

    const { userId, role, status } = await req.json();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role ? (role as any) : undefined,
        status: status ? (status as any) : undefined,
      },
    });

    // Log admin action to audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: role ? "USER_ROLE_UPDATE" : "USER_STATUS_UPDATE",
        actor: user.email,
        target: updated.email,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        metadata: { role, status },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
