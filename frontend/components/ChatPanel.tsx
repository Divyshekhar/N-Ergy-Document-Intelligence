"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Loader2, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { queryDocuments } from "@/lib/api";
import type { Citation } from "@/lib/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleAsk() {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    const userMessage: ChatMessage = {
      id: `msg-${nextId.current++}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsAsking(true);

    try {
      const result = await queryDocuments(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${nextId.current++}`,
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        },
      ]);
    } catch (err) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Something went wrong answering that question.";
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${nextId.current++}`,
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-zinc-400">
            <Sparkles className="h-8 w-8" />
            <p className="text-sm">Upload documents, then ask a question.</p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1.5 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  }`}
                >
                  {message.content}
                </div>
                {message.citations && message.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {message.citations.map((citation, index) => (
                      <span
                        key={`${citation.document_name}-${citation.page_number}-${index}`}
                        className="flex items-center gap-1 rounded-full bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-700"
                      >
                        <BookOpen className="h-3 w-3" />
                        {citation.document_name} &middot; p.{citation.page_number}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isAsking && (
              <div className="flex items-start">
                <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500 dark:bg-zinc-800">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask a question about your documents..."
            disabled={isAsking}
            className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
          />
          <button
            type="button"
            onClick={handleAsk}
            disabled={isAsking || !question.trim()}
            className="flex shrink-0 items-center justify-center rounded-full bg-zinc-900 p-2.5 text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            aria-label="Send question"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
