import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { UserRole } from "@/types";

export async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Retrieve or upsert into Supabase database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      profile: true,
      subscription: true,
      settings: true,
    },
  });

  if (!dbUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@nexus.ai`;
    dbUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        role: "USER",
        profile: {
          create: {
            displayName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split("@")[0],
            avatarUrl: clerkUser.imageUrl,
          },
        },
        settings: {
          create: {
            themePreference: "dark",
          },
        },
        subscription: {
          create: {
            tier: "FREE",
            status: "ACTIVE",
          },
        },
      },
      include: {
        profile: true,
        subscription: true,
        settings: true,
      },
    });
  }

  return dbUser;
}

export async function requireAdmin(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "SUPERADMIN";
}
