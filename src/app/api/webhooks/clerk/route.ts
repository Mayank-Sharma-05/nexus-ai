import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const eventType = payload.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = payload.data;
    const email = email_addresses?.[0]?.email_address;

    if (email) {
      await prisma.user.upsert({
        where: { clerkId },
        create: {
          clerkId,
          email,
          role: "USER",
          profile: {
            create: {
              displayName: `${first_name || ''} ${last_name || ''}`.trim() || email.split("@")[0],
              avatarUrl: image_url,
            },
          },
          settings: { create: { themePreference: "dark" } },
          subscription: { create: { tier: "FREE" } },
        },
        update: {
          email,
          profile: {
            update: {
              displayName: `${first_name || ''} ${last_name || ''}`.trim() || email.split("@")[0],
              avatarUrl: image_url,
            },
          },
        },
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id: clerkId } = payload.data;
    await prisma.user.deleteMany({
      where: { clerkId },
    });
  }

  return NextResponse.json({ success: true });
}
