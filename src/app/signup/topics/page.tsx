"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { twin } from "@/lib/twin";
import styles from "./page.module.css";

const PRESET_TOPICS = [
  { name: "Security & CVEs",        icon: "🔒", cadence: "daily"  },
  { name: "Rust ecosystem",          icon: "🦀", cadence: "weekly" },
  { name: "React / TypeScript",      icon: "⚛️", cadence: "weekly" },
  { name: "EU tech job market",      icon: "🇪🇺", cadence: "daily"  },
  { name: "Cybersecurity news",      icon: "🛡️", cadence: "daily"  },
  { name: "German / Dutch language", icon: "🗣️", cadence: "weekly" },
];

export default function TopicsPage() {
  const router = useRouter();
  const [selected,      setSelected]      = useState<Set<string>>(new Set());
  const [customName,    setCustomName]    = useState("");
  const [customQueries, setCustomQueries] = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

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
      // Get session from Twin Supabase client
      const { data: { session } } = await twin.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        setError("Session expired — please sign in again.");
        router.push("/login");
        return;
      }

      // Build topics array
      const topics: Array<{
        user_id:               string;
        name:                  string;
        search_queries:        string[];
        search_interval_hours: number;
        active:                boolean;
      }> = [];

      // Add selected preset topics
      for (const name of selected) {
        const preset = PRESET_TOPICS.find((p) => p.name === name);
        topics.push({
          user_id:               userId,
          name,
          search_queries:        [name.toLowerCase()],
          search_interval_hours: preset?.cadence === "daily" ? 24 : 168,
          active:                true,
        });
      }

      // Add custom topic if provided
      if (customName.trim()) {
        topics.push({
          user_id:               userId,
          name:                  customName.trim(),
          search_queries:        customQueries
            .split(",")
            .map((q) => q.trim())
            .filter(Boolean),
          search_interval_hours: 168, // weekly default for custom
          active:                true,
        });
      }

      // Insert directly into topics table
      // trigger-learning cron picks these up automatically
      const { error: insertError } = await twin
        .from("topics")
        .insert(topics);

      if (insertError) {
        console.error("[topics] Insert failed:", insertError);
        setError(insertError.message || "Failed to save topics. Please try again.");
        return;
      }

      console.log(`[topics] ${topics.length} topics saved for user ${userId}`);
      router.push("/ai/chat");

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save topics";
      setError(message);
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
            It searches them automatically — daily or weekly.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Preset topics grid */}
        <div className={styles.grid}>
          {PRESET_TOPICS.map((topic) => (
            <button
              key={topic.name}
              className={`${styles.topicCard} ${
                selected.has(topic.name) ? styles.selected : ""
              }`}
              onClick={() => toggle(topic.name)}
            >
              <span className={styles.topicIcon}>{topic.icon}</span>
              <span className={styles.topicName}>{topic.name}</span>
              <span className={styles.topicCadence}>{topic.cadence}</span>
            </button>
          ))}
        </div>

        {/* Custom topic */}
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
          {loading ? "Saving..." : "Continue →"}
        </button>

      </div>
    </div>
  );
}
