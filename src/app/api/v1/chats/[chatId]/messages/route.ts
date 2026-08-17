import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import {
  generateGeminiResponse,
  logGeminiError,
  toGeminiServiceError,
  type GeminiChatMessage,
} from "@/lib/ai/gemini";
import { classifyUserPrompt } from "@/lib/ai/router";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 12_000;
const MAX_HISTORY_MESSAGES = 20;

async function getOwnedChat(chatId: string, userId: string) {
  return prisma.chat.findFirst({ where: { id: chatId, userId, deletedAt: null } });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const chat = await getOwnedChat(chatId, user.id);
  if (!chat) return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });

  const messages = await prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ success: true, data: { chat, messages } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chat = await getOwnedChat(chatId, user.id);
  if (!chat) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  if (content.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Messages must be ${MAX_MESSAGE_LENGTH.toLocaleString()} characters or fewer` }, { status: 400 });
  }

  await prisma.message.create({
    data: { chatId, role: "user", content, tokensUsed: Math.ceil(content.length / 4) },
  });

  const priorMessages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY_MESSAGES,
  });
  const history: GeminiChatMessage[] = priorMessages
    .reverse()
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({ role: message.role === "assistant" ? "model" : "user", content: message.content }));
  const routerSuggestion = classifyUserPrompt(content);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await generateGeminiResponse(history);
        const fullAssistantReply = response.text;
        console.info("[Gemini] Response completed", {
          rawResponse: response.rawResponse,
          parsedText: fullAssistantReply,
          finishReason: response.finishReason,
        });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: fullAssistantReply })}\n\n`));

        const savedMessage = await prisma.message.create({
          data: {
            chatId,
            role: "assistant",
            content: fullAssistantReply,
            tokensUsed: Math.ceil(fullAssistantReply.length / 4),
            routerSuggestion: routerSuggestion.intent === "general_chat" ? undefined : JSON.parse(JSON.stringify(routerSuggestion)),
          },
        });
        const inputTokens = Math.ceil(content.length / 4);
        const outputTokens = Math.ceil(fullAssistantReply.length / 4);
        await Promise.all([
          prisma.user.update({ where: { id: user.id }, data: { tokensConsumed: { increment: inputTokens + outputTokens } } }),
          prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } }),
          prisma.apiUsageLog.create({
            data: { userId: user.id, module: "chat", modelName: "gemini-3.5-flash", inputTokens, outputTokens, costUsd: 0, latencyMs: 0, status: "success" },
          }),
        ]);

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, messageId: savedMessage.id, routerSuggestion: routerSuggestion.intent === "general_chat" ? null : routerSuggestion })}\n\n`));
      } catch (error) {
        logGeminiError(error);
        const safeError = toGeminiServiceError(error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: safeError.message, status: safeError.status })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
