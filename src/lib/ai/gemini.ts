import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-3.5-flash";
const REQUEST_TIMEOUT_MS = 60_000;
const MAX_TRANSIENT_RETRIES = 3;

export type GeminiChatMessage = { role: "user" | "model"; content: string };
export type GeminiGenerationResult = {
  rawResponse: unknown[];
  text: string;
  finishReason?: string;
};

type GeminiSdkError = {
  status?: number;
  code?: number | string;
  message?: string;
  cause?: { code?: string };
};

export class GeminiServiceError extends Error {
  constructor(message: string, public readonly status: number = 502) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

export function logGeminiError(error: unknown) {
  const candidate = error as {
    name?: string;
    message?: string;
    stack?: string;
    status?: number;
    code?: number | string;
    cause?: { name?: string; message?: string; stack?: string; code?: number | string };
  };

  console.error("[Gemini] Request failed", {
    apiKeyDetected: Boolean(process.env.GEMINI_API_KEY?.trim()),
    model: GEMINI_MODEL,
    fullErrorMessage: candidate?.message ?? String(error),
    stackTrace: candidate?.stack,
    status: candidate?.status,
    code: candidate?.code,
    cause: candidate?.cause
      ? {
          name: candidate.cause.name,
          message: candidate.cause.message,
          stackTrace: candidate.cause.stack,
          code: candidate.cause.code,
        }
      : undefined,
  });
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiServiceError("Gemini is not configured. Please contact the administrator.", 503);
  }
  return new GoogleGenAI({ apiKey });
}

function getErrorStatus(error: unknown): number | undefined {
  const candidate = error as GeminiSdkError;
  const status = candidate?.status ?? candidate?.code;
  if (typeof status === "number") return status;
  if (typeof status === "string" && /^\d+$/.test(status)) return Number(status);

  const nestedStatus = candidate?.message?.match(/"code"\s*:\s*(\d{3})/)?.[1];
  return nestedStatus ? Number(nestedStatus) : undefined;
}

function isTransientGeminiError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 429 || (status !== undefined && status >= 500 && status < 600);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createGeminiRequestPayload(history: GeminiChatMessage[]) {
  return {
    model: GEMINI_MODEL,
    contents: history.map(({ role, content }) => ({ role, parts: [{ text: content }] })),
    config: {
      systemInstruction: "You are Nexus AI, a helpful assistant for the Nexus AI creation platform. Give accurate, practical answers. Do not claim to have performed actions you have not performed.",
      temperature: 0.7,
      maxOutputTokens: 2048,
      httpOptions: { timeout: REQUEST_TIMEOUT_MS },
    },
  };
}

export function toGeminiServiceError(error: unknown): GeminiServiceError {
  if (error instanceof GeminiServiceError) return error;
  const candidate = error as GeminiSdkError;
  const status = getErrorStatus(error);

  if (status === 401 || status === 403) return new GeminiServiceError("The configured Gemini credentials were rejected.", 502);
  if (status === 404) return new GeminiServiceError("The configured Gemini model is unavailable. Please contact the administrator.", 503);
  if (status === 429) return new GeminiServiceError("Gemini is busy right now. Please try again in a moment.", 429);
  if (status === 408 || status === 504) return new GeminiServiceError("The Gemini request timed out. Please try again.", 504);
  if (status !== undefined && status >= 500) return new GeminiServiceError("Gemini is temporarily unavailable. Please try again in a moment.", 503);
  if (candidate?.cause?.code === "EACCES" || candidate?.cause?.code === "ENETUNREACH") {
    return new GeminiServiceError("The server cannot reach Gemini. Please check its outbound HTTPS access.", 503);
  }
  return new GeminiServiceError("Gemini could not generate a response. Please try again.");
}

export async function generateGeminiResponse(history: GeminiChatMessage[]): Promise<GeminiGenerationResult> {
  const requestPayload = createGeminiRequestPayload(history);

  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt += 1) {
    console.info("[Gemini] Starting request", {
      apiKeyDetected: Boolean(process.env.GEMINI_API_KEY?.trim()),
      model: GEMINI_MODEL,
      attempt: attempt + 1,
      userMessage: history.at(-1)?.content,
      conversationHistory: history,
      requestPayload,
    });

    try {
      const responseStream = await getGeminiClient().models.generateContentStream(requestPayload);
      const rawResponse: unknown[] = [];
      let text = "";
      let finishReason: string | undefined;

      for await (const chunk of responseStream) {
        rawResponse.push(chunk);
        text += chunk.text ?? "";
        finishReason = chunk.candidates?.[0]?.finishReason ?? finishReason;
      }

      if (!text.trim()) throw new Error("Gemini returned an empty response");

      return { rawResponse, text, finishReason };
    } catch (error) {
      logGeminiError(error);
      if (!isTransientGeminiError(error) || attempt === MAX_TRANSIENT_RETRIES) {
        throw toGeminiServiceError(error);
      }

      const delayMs = 1_000 * 2 ** attempt;
      console.warn("[Gemini] Retrying transient provider failure", { attempt: attempt + 1, delayMs });
      await wait(delayMs);
    }
  }

  throw new GeminiServiceError("Gemini could not generate a response. Please try again.");
}

export { GEMINI_MODEL };
