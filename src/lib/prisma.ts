import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getRuntimeDatabaseUrl(): string | undefined {
  const databaseUrl = process.env.DATABASE_URL;
  const poolerHost = process.env.SUPABASE_POOLER_HOST?.trim();

  if (!databaseUrl || !poolerHost) return databaseUrl;

  const url = new URL(databaseUrl);
  const directHostMatch = /^db\.([a-z0-9]+)\.supabase\.co$/i.exec(url.hostname);
  if (!directHostMatch) return databaseUrl;

  const projectRef = directHostMatch[1];
  url.hostname = poolerHost;
  url.port = "6543";
  if (decodeURIComponent(url.username) === "postgres") {
    url.username = `postgres.${projectRef}`;
  }
  url.searchParams.set("pgbouncer", "true");
  url.searchParams.set("connection_limit", "1");
  url.searchParams.set("sslmode", "require");

  return url.toString();
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getRuntimeDatabaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
