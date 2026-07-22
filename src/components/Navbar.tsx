"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser, signOut } from "@/lib/twin-auth";
import { twin } from "@/lib/twin";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "AI", href: "/ai" },
  { label: "Extensions", href: "/extensions" },
  { label: "Download", href: "/#download" },
  { label: "Newsletter", href: "/newsletter" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const u = getUser();
    setUser(u);

    if (u) {
      twin
        .from("profiles")
        .select("name")
        .eq("id", u.id)
        .single()
        .then(({ data }) => {
          setDisplayName(data?.name || u.email);
        });
    } else {
      setDisplayName("");
    }
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setDisplayName("");
    router.push("/");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img
            src="/forge-logo.png"
            alt=""
            className={styles.logo}
            aria-hidden="true"
          />
          <span className={styles.brandText}>Mentenaz Forge</span>
        </Link>

        <div className={styles.links}>
          {navLinks.map((link) => {
            const isHash = link.href.startsWith("/#");
            const isActive = isHash
              ? false
              : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className={styles.authArea}>
              <Link href="/profile" className={styles.userEmail}>
                {displayName}
              </Link>
              <button className={styles.authBtn} onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`${styles.link} ${pathname === "/login" ? styles.linkActive : ""}`}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
