# Gemini Integration Diagnostic Report

## Integration audit

- Environment variable: `GEMINI_API_KEY` is present in `.env.local` (only its presence was checked; its value was never logged).
- Server initialization: `GoogleGenAI` is created only in `src/lib/ai/gemini.ts`, which is imported by a Node.js API route. The API key is never sent to the browser.
- Request payload: the route maps persisted chat messages to Gemini `user` and `model` roles with `parts: [{ text }]`, which is the expected SDK structure.
- Streaming parse: the server reads `chunk.text` from the SDK stream and forwards it as SSE JSON `delta` events; the client reads and appends those events correctly.
- Error handling: provider, timeout, credentials, rate-limit, model, and network failures now map to safe user messages while complete diagnostics stay in server logs.

## Root cause

The key is valid, but the configured `gemini-2.5-flash` model returned HTTP 404:

`This model models/gemini-2.5-flash is no longer available to new users.`

The API listed the model but rejected generation for this credential. The application therefore caught the provider error and replaced it with the generic user-facing message.

## Fix and verification

The application now uses `gemini-3.7-flash`, a stable model enabled for this key. A direct streaming SDK request with `hello` completed successfully and returned:

`Hello! How can I help you today?`

## Server diagnostics

Each request now logs:

- `apiKeyDetected` as `true` or `false` only;
- the selected model;
- the full provider error message;
- the full stack trace;
- provider status/code and nested network cause when present.

No key material, prompts, or response contents are added to error logs.
