# Nexus AI Chat Audit

## Current behavior

The dashboard chat page (`src/app/(dashboard)/chat/page.tsx`) keeps messages only in React state. On submit, it appends an assistant placeholder and fills it word-by-word from a hardcoded response. It does not call an API route, Gemini, or the chat persistence API.

The repository also contains `POST /api/v1/chats/[chatId]/messages`, which creates a Server-Sent Events (SSE) response and persists messages. It was not connected to the dashboard UI. The route called `generateGeminiStreaming` from `src/lib/ai/gemini.ts` with only the newest prompt, so prior conversation context was not sent to Gemini. It also did not verify that the requested chat belongs to the authenticated user.

## Problems found

- `src/app/(dashboard)/chat/page.tsx` contains the hardcoded “I have analyzed your prompt…” response and a `setTimeout`-based simulated stream.
- `src/lib/ai/gemini.ts` returns a fake async stream when `GEMINI_API_KEY` is absent or when Gemini returns an error. This hides configuration, authentication, rate-limit, and provider failures.
- The Gemini helper defaulted to `gemini-2.0-flash`, not the requested Gemini 2.5 Flash model.
- The existing SSE endpoint was unused by the UI and lacked chat ownership validation.
- The client did not create a real conversation, store a `chatId`, parse SSE, or show API/network errors.
- The chat UI displayed hardcoded model and latency marketing data. It did not represent a live model connection.
- The legacy static prototype under `js/modules/chat.js` has additional mock chat behavior, but it is not imported by the Next.js dashboard. It is outside the active chat flow and is left unchanged.

## Files involved

- `src/app/(dashboard)/chat/page.tsx` — active client chat UI and mock stream.
- `src/app/api/v1/chats/route.ts` — creates and lists persisted chats.
- `src/app/api/v1/chats/[chatId]/messages/route.ts` — server-side streaming endpoint.
- `src/lib/ai/gemini.ts` — Gemini SDK wrapper and fake fallback.
- `src/lib/ai/router.ts` — deterministic action-card classifier.
- `src/lib/clerk.ts` and `prisma/schema.prisma` — authenticated user lookup and chat/message persistence.

## Fix strategy

1. Replace fake fallback behavior with a server-only Gemini helper that validates `GEMINI_API_KEY` when invoked and maps provider errors to safe API errors.
2. Enhance the existing SSE endpoint with validation, chat ownership checks, bounded recent history, a request timeout, structured error events, and usage logging.
3. Make the chat UI create a conversation on first send, send messages to the SSE endpoint, parse real streamed chunks, and show friendly errors without changing its visual design.
4. Keep the Gemini key server-side only; the browser receives streamed response text and safe error messages, never credentials.
