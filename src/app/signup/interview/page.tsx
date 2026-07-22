"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/twin-auth";
import styles from "./page.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAPTERS = [
  { label: "Background", max: 4 },
  { label: "Beliefs", max: 7 },
  { label: "Voice", max: 9 },
  { label: "Interests", max: 11 },
  { label: "Goals", max: 99 },
];

export default function InterviewPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [building, setBuilding] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const exchangeCount = messages.filter((m) => m.role === "user").length;
  const currentChapter = CHAPTERS.findIndex((c) => exchangeCount < c.max);
  const progress = Math.min(
    (exchangeCount / (CHAPTERS[CHAPTERS.length - 2].max)) * 100,
    100
  );

  const send = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    abortRef.current = new AbortController();
    const token = getAccessToken();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TWIN_URL}/functions/v1/interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            session_id: sessionId,
            history: messages.slice(0, -1),
          }),
          signal: abortRef.current.signal,
        }
      );

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.session_id && !sessionId) {
              setSessionId(parsed.session_id);
            }
            if (parsed.interview_complete) {
              setBuilding(true);
              await generateIdentity(token!);
              router.push("/signup/topics");
              return;
            }
            const text = parsed.chunk ?? "";
            fullResponse += text;
            const display = fullResponse.replace(/\[INTERVIEW_COMPLETE\]/g, "").trim();
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].content = display;
              return updated;
            });
          } catch {}
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Interview error:", err);
      }
    } finally {
      setStreaming(false);
    }
  };

  const generateIdentity = async (token: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_TWIN_URL}/functions/v1/generate-identity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            transcript: messages,
          }),
        }
      );
    } catch (err) {
      console.error("Identity generation error:", err);
    }
  };

  if (building) {
    return (
      <div className={styles.page}>
        <div className={styles.buildingOverlay}>
          <div className={styles.spinner} />
          <h2 className={styles.buildingTitle}>Building your twin...</h2>
          <p className={styles.buildingSub}>
            Analyzing your responses and creating your digital identity
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.progressArea}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.chapters}>
          {CHAPTERS.slice(0, -1).map((ch, i) => (
            <span
              key={ch.label}
              className={`${styles.chapter} ${
                i < currentChapter
                  ? styles.chapterDone
                  : i === currentChapter
                    ? styles.chapterActive
                    : ""
              }`}
            >
              {ch.label}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Let&apos;s get to know you</h2>
            <p className={styles.emptySub}>
              This interview builds your AI Twin&apos;s identity. Answer
              naturally — there are no wrong answers.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.role === "user" ? styles.userMsg : styles.assistantMsg
            }`}
          >
            {msg.role === "assistant" && (
              <span className={styles.avatar}>⚡</span>
            )}
            <div className={styles.bubble}>
              {msg.content}
              {streaming && i === messages.length - 1 && !msg.content && (
                <span className={styles.typing}>●●●</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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
          placeholder="Type your answer..."
          rows={2}
          disabled={streaming}
        />
        <button
          className={styles.sendBtn}
          onClick={send}
          disabled={!input.trim() || streaming}
        >
          ↑ Send
        </button>
      </div>
    </div>
  );
}
