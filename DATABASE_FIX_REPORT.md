# Nexus AI Database Connection Report

## Root cause

The application was attempting to use `DATABASE_URL` at `db.hvxzrzyfvzexhdvxdffw.supabase.co:5432`. DNS resolves this direct Supabase database hostname to an IPv6 address only in this environment. Prisma therefore fails during its first query with “Can't reach database server” before Gemini is called.

Both `.env` and `.env.local` had the same direct endpoint for `DATABASE_URL` and `DIRECT_URL`, with no explicit SSL mode. `DATABASE_URL` is the URL Prisma Client uses at runtime; `DIRECT_URL` is for Prisma CLI operations such as migrations. The client had no pooler override, so it always attempted the unreachable direct endpoint.

The direct endpoint's IPv6 range identifies the project as being in AWS Singapore (`ap-southeast-1`). This is an inference from its resolved address; verify the host in Supabase Dashboard > Connect if the project is moved.

## Authentication and chat flow

1. Clerk middleware requires authentication for dashboard and chat API routes.
2. Each chat request calls `getAuthenticatedUser()` in `src/lib/clerk.ts`.
3. That function calls `prisma.user.findUnique({ where: { clerkId } })` to obtain (or create) the internal database user.
4. The chat endpoint then uses that internal user ID to verify conversation ownership and persist messages.
5. Only after those database operations does the endpoint call Gemini.

The lookup is required: there is no safe fallback because anonymous access would bypass conversation ownership and message persistence. The database connection, rather than Gemini, was blocking the request.

## Fixes applied

- Added `SUPABASE_POOLER_HOST="aws-0-ap-southeast-1.pooler.supabase.com"` to `.env` and `.env.local` and documented it in `.env.example`.
- Updated `src/lib/prisma.ts` so runtime Prisma traffic automatically converts a Supabase direct hostname into the configured pooler URL.
- The resulting runtime URL uses port `6543`, `pgbouncer=true`, `connection_limit=1`, and `sslmode=require`.
- Preserved `DIRECT_URL` for Prisma migration tooling; it is not used by Prisma Client for requests.
- Kept the singleton Prisma Client initialization to prevent excess clients during Next.js development reloads.

## Environment validation

- `DATABASE_URL`: present in both `.env` and `.env.local`; previously pointed to the direct IPv6-only endpoint.
- `DIRECT_URL`: present in both files; retained for direct/migration workflows.
- `SUPABASE_POOLER_HOST`: now present in both files and selects the matching Singapore pooler.
- `GEMINI_API_KEY`: present; no secret values were read or reported.
- A direct Prisma connection test reproduced the reported failure. Raw TCP connections to pooler port 6543 cannot be verified from this execution sandbox, so final live validation must run from the application host after restart.

## Files modified

- `src/lib/prisma.ts`
- `.env`
- `.env.local`
- `.env.example`
- `DATABASE_FIX_REPORT.md`

## Test results

- Direct endpoint DNS: resolves only to IPv6 in this environment.
- Direct Prisma connection: failed with the same "Can't reach database server" error reported by the application.
- Pooler host DNS: resolves to IPv4 addresses, which is the required runtime path for this environment.
- Exact pooler Prisma connection: the execution sandbox still reports that port 6543 is unreachable. This is consistent with its restricted outbound PostgreSQL networking and is not a credential or Prisma-query error.
- Full authenticated chat/Gemini test: requires restarting the running Next.js process so it reads the new environment, then signing in through Clerk. It cannot be completed inside this sandbox because its outbound PostgreSQL port is unavailable.

## Final verification steps

1. Stop the existing Next.js process and run `npm run dev` again. Next.js only loads `.env.local` at process startup.
2. Sign in and send `hello` from `/chat`.
3. Confirm the chat API creates/looks up the user, creates a conversation, and streams a Gemini response.
4. If the connection still fails, copy the exact **Transaction pooler** host shown in Supabase Dashboard > Connect into `SUPABASE_POOLER_HOST`, restart the app, and retry.
