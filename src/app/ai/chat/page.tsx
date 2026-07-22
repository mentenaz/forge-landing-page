"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAccessToken, getUser } from "@/lib/twin-auth";
import styles from "./chat.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Mode = "chat" | "brainstorm" | "code";

const GUEST_LIMIT = 5;

const SUGGESTIONS: Record<Mode, string[]> = {
  chat: [
    "What is Mentenaz Forge?",
    "How does the AI Twin work?",
    "What languages does Forge support?",
  ],
  brainstorm: [
    "Help me plan a React component architecture",
    "Brainstorm ideas for a developer dashboard",
    "What features should a code editor have?",
  ],
  code: [
    "Write a TypeScript utility for debouncing",
    "Help me write a Rust command for file watching",
    "Create a React hook for dark mode",
  ],
};

const PLACEHOLDERS: Record<Mode, string> = {
  chat: "Ask anything...",
  brainstorm: "What do you want to explore?",
  code: "Describe what you want to build...",
};

export default function ForgeAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("chat");
  const [streaming, setStreaming] = useState(false);
  const streamingRef = useRef(false);
  const lastSendTime = useRef(0);
  const [guestCount, setGuestCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sseBufferRef = useRef("");

  useEffect(() => {
    setIsAuthed(!!getAccessToken());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streamingRef.current) return;

    // Debounce: prevent double-fire within 500ms
    const now = Date.now();
    if (now - lastSendTime.current < 500) return;
    lastSendTime.current = now;

    // Guest mode: enforce limit
    if (!isAuthed && guestCount >= GUEST_LIMIT) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    streamingRef.current = true;
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    if (!isAuthed) {
      setGuestCount((c) => c + 1);
    }

    abortRef.current = new AbortController();
    sseBufferRef.current = "";

    const processSSELine = (line: string) => {
      const data = line.slice(6); // strip "data: "
      if (data === "[DONE]") return false;
      try {
        const parsed = JSON.parse(data);
        const text = parsed.chunk ?? "";
        if (text) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, content: last.content + text };
            return updated;
          });
        }
      } catch {}
      return true;
    };

    const processSSEBuffer = (raw: string) => {
      const combined = sseBufferRef.current + raw;
      const parts = combined.split("\n\n");
      sseBufferRef.current = parts.pop() ?? "";
      for (const part of parts) {
        const line = part.trim();
        if (line.startsWith("data: ")) {
          if (!processSSELine(line)) break;
        }
      }
    };

    try {
      const token = getAccessToken();

      if (token) {
        // Authenticated: use ai-chat Edge Function with user's JWT
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const res = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: userMessage, mode }),
          signal: abortRef.current.signal,
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          processSSEBuffer(decoder.decode(value, { stream: true }));
        }
      } else {
        // Guest: use guest-chat Edge Function (HuggingFace, no auth)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const res = await fetch(`${supabaseUrl}/functions/v1/guest-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages.slice(0, -1),
          }),
          signal: abortRef.current.signal,
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          processSSEBuffer(decoder.decode(value, { stream: true }));
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Chat error:", err);
      }
    } finally {
      streamingRef.current = false;
      setStreaming(false);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    sseBufferRef.current = "";
    streamingRef.current = false;
    setStreaming(false);
  };

  const limitReached = !isAuthed && guestCount >= GUEST_LIMIT;

  return (
    <div className={styles.chatPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.homeLink}>
            <img src="/forge-logo.png" alt="" className={styles.homeLogo} />
          </Link>
          <Link href="/ai" className={styles.brand}>
            {"\u26A1"} Mentenaz AI
          </Link>
        </div>
        <div className={styles.modes}>
          {(["chat", "brainstorm", "code"] as Mode[]).map((m) => (
            <button
              key={m}
              className={`${styles.modeBtn} ${mode === m ? styles.active : ""}`}
              onClick={() => setMode(m)}
            >
              {m === "chat" ? "Chat" : m === "brainstorm" ? "Brainstorm" : "Code Assist"}
            </button>
          ))}
        </div>
        {!isAuthed && (
          <div className={styles.guestBadge}>
            Guest {guestCount}/{GUEST_LIMIT}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>What can I help you with?</h2>
            <p className={styles.emptySub}>
              {isAuthed
                ? "Powered by Mentenaz AI \u2014 the same intelligence inside Forge."
                : `Try it free \u2014 ${GUEST_LIMIT - guestCount} messages left. Sign up for full access.`}
            </p>
            <div className={styles.suggestions}>
              {SUGGESTIONS[mode].map((s, i) => (
                <button
                  key={i}
                  className={styles.suggestion}
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.role === "user" ? styles.userMsg : styles.assistantMsg}`}
          >
            {msg.role === "assistant" && (
              <span className={styles.avatar}>{"\u26A1"}</span>
            )}
            <div className={styles.bubble}>
              {msg.role === "assistant" ? (
                <div className={styles.markdown}>
                  <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                </div>
              ) : (
                msg.content
              )}
              {streaming && i === messages.length - 1 && !msg.content && (
                <span className={styles.typing}>{"\u25CF\u25CF\u25CF"}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Limit banner */}
      {limitReached && (
        <div className={styles.limitBanner}>
          <p>You&apos;ve used all free messages.</p>
          <Link href="/signup" className={styles.limitLink}>
            Create account for unlimited chat, brainstorming, and code assist {"\u2192"}
          </Link>
        </div>
      )}

      {/* Input */}
      <div className={styles.inputArea}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={limitReached ? "Sign up to continue..." : PLACEHOLDERS[mode]}
          rows={2}
          disabled={streaming || limitReached}
        />
        {streaming ? (
          <button className={styles.stopBtn} onClick={stop}>
            {"\u25A0"} Stop
          </button>
        ) : (
          <button
            className={styles.sendBtn}
            onClick={send}
            disabled={!input.trim() || streaming || limitReached}
          >
            {"\u2191"} Send
          </button>
        )}
      </div>

      {/* CTA */}
      {!isAuthed && (
        <div className={styles.cta}>
          <span className={styles.ctaText}>Get Fix It, SQL AI, and Git AI inside your editor</span>
          <Link href="/#download" className={styles.ctaLink}>
            Install Forge {"\u2192"}
          </Link>
        </div>
      )}
    </div>
  );
}
