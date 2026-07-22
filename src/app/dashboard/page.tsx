"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, signOut } from "@/lib/twin-auth";
import styles from "./page.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome, {user.email}</p>
        </div>

        <div className={styles.actions}>
          <Link href="/ai/chat" className={styles.actionCard}>
            <span className={styles.actionIcon}>{ }</span>
            <span className={styles.actionLabel}>Open Chat</span>
            <span className={styles.actionDesc}>Talk to your AI Twin</span>
          </Link>
          <Link href="/signup/interview" className={styles.actionCard}>
            <span className={styles.actionIcon}>{ }</span>
            <span className={styles.actionLabel}>Re-interview</span>
            <span className={styles.actionDesc}>Update your identity</span>
          </Link>
        </div>

        <button className={styles.signOutBtn} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
