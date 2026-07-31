"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { twin } from "@/lib/twin";
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
    (exchangeCount / CHAPTERS[CHAPTERS.length - 2].max) * 100,
    100
  );

  const send = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = input.trim();
    setInput("");
    setStreaming(true);

    // Get session from twin client
    const {
      data: { session },
    } = await twin.auth.getSession();

    const userId = session?.user?.id;
    const token = session?.access_token;

    if (!userId || !token) {
      console.error("[interview] No session — redirecting to login");
      router.push("/login");
      return;
    }

    // Build history BEFORE adding new user message
    const historyBeforeSend: Message[] = [...messages];

    // Optimistically add user message + empty assistant placeholder
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    abortRef.current = new AbortController();

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
            user_id: userId,
            session_id: sessionId ?? undefined,
            conversation_history: historyBeforeSend,
          }),
          signal: abortRef.current.signal,
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("[interview] Edge function error:", res.status, errData);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let interviewDone = false;

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        const lines = raw.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);

            // Capture session_id from first response
            if (parsed.session_id && !sessionId) {
              setSessionId(parsed.session_id);
            }

            // Stream chunk to UI
            if (typeof parsed.chunk === "string") {
              fullResponse += parsed.chunk;
              // Strip signal token from display
              const display = fullResponse
                .replace(/\[INTERVIEW_COMPLETE\]/g, "")
                .trim();
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: display,
                };
                return updated;
              });
            }

            // Interview complete — build identity
            if (parsed.done && parsed.interview_complete) {
              interviewDone = true;
              setBuilding(true);

              // Build full transcript for generate-identity
              const fullTranscript: Message[] = [
                ...historyBeforeSend,
                { role: "user", content: userMessage },
                {
                  role: "assistant",
                  content: fullResponse
                    .replace(/\[INTERVIEW_COMPLETE\]/g, "")
                    .trim(),
                },
              ];

              await generateIdentity(token, userId, fullTranscript);
              router.push("/signup/topics");
              return;
            }
          } catch {
            /* skip malformed chunks */
          }
        }
      }

      if (!interviewDone) {
        console.log(
          `[interview] Exchange ${exchangeCount + 1} complete — interview ongoing`
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("[interview] Fetch error:", err);
      }
    } finally {
      setStreaming(false);
    }
  };

  const generateIdentity = async (
    token: string,
    userId: string,
    transcript: Message[]
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TWIN_URL}/functions/v1/generate-identity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            interview_transcript: transcript,
          }),
        }
      );

      const data = await res.json();
      console.log("[generate-identity] result:", data);

      if (!data.ready) {
        console.warn("[generate-identity] not ready:", data);
      }
    } catch (err) {
      console.error("[generate-identity] error:", err);
    }
  };

  // ── Building overlay ───────────────────────────────────────
  if (building) {
    return (
      <div className={styles.page}>
        <div className={styles.buildingOverlay}>
          <div className={styles.spinner} />
          <h2 className={styles.buildingTitle}>Building your twin...</h2>
          <p className={styles.buildingSub}>
            Analyzing your responses and creating your digital identity.
            This takes about 30 seconds.
          </p>
        </div>
      </div>
    );
  }

  // ── Main interview UI ──────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.progressArea}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
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
              {streaming &&
                i === messages.length - 1 &&
                msg.role === "assistant" &&
                !msg.content && (
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
