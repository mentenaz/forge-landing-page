"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser, signOut } from "@/lib/twin-auth";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "AI", href: "/ai" },
  { label: "Extensions", href: "/extensions" },
  { label: "Download", href: "/#download" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
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
              <span className={styles.userEmail}>{user.email}</span>
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
