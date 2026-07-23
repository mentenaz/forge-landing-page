"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/twin-auth";
import { twin } from "@/lib/twin";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

interface Profile {
  name: string | null;
  is_admin: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);

    twin
      .from("profiles")
      .select("name, is_admin")
      .eq("id", u.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [router]);

  if (!user) return null;

  const displayName = profile?.name || user.email;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome, {displayName}</p>
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
          <Link href="/profile" className={styles.actionCard}>
            <span className={styles.actionIcon}>{ }</span>
            <span className={styles.actionLabel}>Profile</span>
            <span className={styles.actionDesc}>Manage your account</span>
          </Link>
          {profile?.is_admin === "true" && (
            <Link href="/admin" className={styles.actionCard}>
              <span className={styles.actionIcon}>{ }</span>
              <span className={styles.actionLabel}>Admin</span>
              <span className={styles.actionDesc}>Manage newsletter, extensions, users</span>
            </Link>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}
