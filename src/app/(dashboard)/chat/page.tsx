"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mic, Paperclip, Pin, Send, Sparkles } from "lucide-react";

type RouterSuggestion = {
  intent: "website" | "portfolio" | "resume" | "rag";
  title: string;
  actionUrl: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  routerSuggestion?: RouterSuggestion;
};

type Conversation = { id: string; title: string; pinned: boolean };

const createLocalId = () => `local-${crypto.randomUUID()}`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/chats");
      if (!response.ok) throw new Error("Unable to load conversations");
      const result = await response.json();
      setConversations(result.data ?? []);
    } catch {
      setError("Your conversations could not be loaded. Please refresh the page.");
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const openConversation = async (chatId: string) => {
    if (isStreaming || chatId === activeChatId) return;
    setError(null);
    try {
      const response = await fetch(`/api/v1/chats/${chatId}/messages`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to load the conversation");
      setActiveChatId(chatId);
      setMessages(
        result.data.messages.map((message: Message & { routerSuggestion?: RouterSuggestion | null }) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          routerSuggestion: message.routerSuggestion ?? undefined,
        }))
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load the conversation.");
    }
  };

  const createConversation = async (prompt: string) => {
    const response = await fetch("/api/v1/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: prompt.slice(0, 60) || "New Conversation" }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to create a conversation");
    const chat = result.data as Conversation;
    setActiveChatId(chat.id);
    setConversations((current) => [chat, ...current]);
    return chat.id;
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userPrompt = input.trim();
    const userMessage: Message = { id: createLocalId(), role: "user", content: userPrompt };
    const assistantMessageId = createLocalId();
    setInput("");
    setError(null);
    setMessages((current) => [...current, userMessage, { id: assistantMessageId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const chatId = activeChatId ?? (await createConversation(userPrompt));
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 70_000);
      const response = await fetch(`/api/v1/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userPrompt }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (!response.ok || !response.body) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "Unable to reach Gemini. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamError: string | null = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event.split("\n").find((line) => line.startsWith("data: "));
          if (!dataLine) continue;
          const payload = JSON.parse(dataLine.slice(6)) as {
            delta?: string;
            error?: string;
            routerSuggestion?: RouterSuggestion | null;
          };
          if (payload.error) {
            streamError = payload.error;
            continue;
          }
          if (payload.delta) {
            setMessages((current) => current.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: message.content + payload.delta! }
                : message
            ));
          }
          if (payload.routerSuggestion) {
            setMessages((current) => current.map((message) =>
              message.id === assistantMessageId ? { ...message, routerSuggestion: payload.routerSuggestion! } : message
            ));
          }
        }
      }

      if (streamError) throw new Error(streamError);
      await loadConversations();
    } catch (caughtError) {
      setMessages((current) => current.filter((message) => message.id !== assistantMessageId));
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
        setError("The response took too long. Please try again.");
      } else {
        setError(caughtError instanceof Error ? caughtError.message : "Unable to send your message. Please try again.");
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const startNewChat = () => {
    if (isStreaming) return;
    setActiveChatId(null);
    setMessages([]);
    setError(null);
  };

  const activeTitle = conversations.find((chat) => chat.id === activeChatId)?.title ?? "New Conversation";

  return (
    <div className="flex flex-1 h-[calc(100vh-100px)] overflow-hidden">
      <aside className="w-72 bg-[#0C0F17] border-r border-[#1E2433] flex flex-col p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Conversations</span>
          <button onClick={startNewChat} disabled={isStreaming} className="btn-electric text-xs py-1.5 px-3 disabled:opacity-50">+ New Chat</button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {conversations.map((chat) => (
            <button key={chat.id} onClick={() => void openConversation(chat.id)} className={`w-full p-3 rounded-xl text-left text-xs font-medium flex items-center justify-between transition ${chat.id === activeChatId ? "bg-[#131722] border border-cyan-500/40 text-cyan-300" : "text-gray-400 hover:text-white hover:bg-[#131722]"}`}>
              <span className="truncate">{chat.title}</span>
              {chat.pinned && <Pin className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          ))}
          {conversations.length === 0 && <p className="px-3 py-2 text-xs text-gray-500">Your conversations will appear here.</p>}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#08090C] overflow-hidden">
        <div className="border-b border-[#1E2433] px-6 py-3 flex items-center justify-between bg-[#0B0E14]/70">
          <div className="flex items-center gap-2 font-bold text-white text-sm"><span>{activeTitle}</span></div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:px-24 space-y-6">
          {messages.length === 0 && <div className="h-full flex items-center justify-center text-sm text-gray-500">Start a conversation with Nexus AI.</div>}
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            return <div key={message.id} className={`flex gap-4 ${isAssistant ? "" : "justify-end"}`}>
              {isAssistant && <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-xs shadow-glow-cyan flex-shrink-0">⚡</div>}
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${isAssistant ? "bg-[#131722] border border-[#1E2433] text-gray-200" : "bg-[#182236] border border-[#293855] text-white"}`}>
                <div className="whitespace-pre-wrap">{message.content || (isStreaming ? "Thinking…" : "")}</div>
                {message.routerSuggestion && <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-bold text-white"><Sparkles className="w-4 h-4 text-cyan-400" />{message.routerSuggestion.title}</div><Link href={message.routerSuggestion.actionUrl} className="btn-electric text-xs py-1 px-3 flex items-center gap-1">Launch <ArrowRight className="w-3.5 h-3.5" /></Link></div>}
              </div>
            </div>;
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 md:px-24 border-t border-[#1E2433] bg-[#0B0E14]">
          {error && <p role="alert" className="mb-2 text-xs text-red-300">{error}</p>}
          <div className="glass-panel p-2 flex flex-col gap-2 focus-within:border-cyan-400 transition">
            <textarea rows={2} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void handleSend(); } }} placeholder="Ask Nexus AI anything, or say 'Create a gym website', 'Analyze my resume'..." className="w-full bg-transparent text-white text-sm outline-none px-3 py-1 resize-none" />
            <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 px-2"><div className="flex items-center gap-2 text-gray-400 text-xs"><button title="Voice Input" className="p-1 hover:text-cyan-400 transition"><Mic className="w-4 h-4" /></button><button title="Attach PDF" className="p-1 hover:text-cyan-400 transition"><Paperclip className="w-4 h-4" /></button></div><button onClick={() => void handleSend()} disabled={isStreaming || !input.trim()} className="btn-electric text-xs py-1.5 px-4 flex items-center gap-1.5 disabled:opacity-50">{isStreaming ? "Sending…" : "Send"} <Send className="w-3.5 h-3.5" /></button></div>
          </div>
        </div>
      </main>
    </div>
  );
}
