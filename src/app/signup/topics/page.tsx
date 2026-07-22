"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/twin-auth";
import styles from "./page.module.css";

const PRESET_TOPICS = [
  { name: "Security & CVEs", icon: "\uD83D\uDD12", cadence: "daily" },
  { name: "Rust ecosystem", icon: "\uD83E\uDD80", cadence: "weekly" },
  { name: "React / TypeScript", icon: "\u269B\uFE0F", cadence: "weekly" },
  { name: "EU tech job market", icon: "\uD83C\uDDEA\uD83C\uDDFA", cadence: "daily" },
  { name: "Cybersecurity news", icon: "\uD83D\uDEE1\uFE0F", cadence: "daily" },
  { name: "German / Dutch language", icon: "\uD83D\uDDE3\uFE0F", cadence: "weekly" },
];

export default function TopicsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customName, setCustomName] = useState("");
  const [customQueries, setCustomQueries] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleContinue = async () => {
    if (selected.size === 0 && !customName.trim()) return;
    setLoading(true);
    setError("");

    try {
      const token = getAccessToken();
      const topics: Array<{ name: string; search_queries: string[]; cadence: string }> = [];

      for (const name of selected) {
        const preset = PRESET_TOPICS.find((p) => p.name === name);
        topics.push({
          name,
          search_queries: [name.toLowerCase()],
          cadence: preset?.cadence ?? "weekly",
        });
      }

      if (customName.trim()) {
        topics.push({
          name: customName.trim(),
          search_queries: customQueries.split(",").map((q) => q.trim()).filter(Boolean),
          cadence: "weekly",
        });
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TWIN_URL}/functions/v1/update-topic-weight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ topics }),
        }
      );

      if (!res.ok) {
        const d = await res.text();
        console.error("Topic save failed:", d);
      }

      router.push("/ai/chat");
    } catch (err: any) {
      setError(err.message || "Failed to save topics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>What should your Twin learn?</h1>
          <p className={styles.subtitle}>
            Pick topics your AI Twin will research and stay current on.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.grid}>
          {PRESET_TOPICS.map((topic) => (
            <button
              key={topic.name}
              className={`${styles.topicCard} ${selected.has(topic.name) ? styles.selected : ""}`}
              onClick={() => toggle(topic.name)}
            >
              <span className={styles.topicIcon}>{topic.icon}</span>
              <span className={styles.topicName}>{topic.name}</span>
              <span className={styles.topicCadence}>{topic.cadence}</span>
            </button>
          ))}
        </div>

        <div className={styles.customSection}>
          <h3 className={styles.customTitle}>Custom topic</h3>
          <input
            className={styles.input}
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Topic name..."
          />
          {customName && (
            <input
              className={styles.input}
              type="text"
              value={customQueries}
              onChange={(e) => setCustomQueries(e.target.value)}
              placeholder="Search queries, comma-separated..."
            />
          )}
        </div>

        <button
          className={styles.continueBtn}
          onClick={handleContinue}
          disabled={loading || (selected.size === 0 && !customName.trim())}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
