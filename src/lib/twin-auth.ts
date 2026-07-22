import { twin } from "./twin";
import type { Session, User } from "@supabase/supabase-js";

const STORAGE_KEY = "twin_session";

export interface TwinSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email: string };
}

export function getCachedSession(): TwinSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s: TwinSession = JSON.parse(raw);
    if (Date.now() / 1000 > s.expires_at - 60) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function setCachedSession(s: Session) {
  const data: TwinSession = {
    access_token: s.access_token,
    refresh_token: s.refresh_token,
    expires_at: s.expires_at ?? 0,
    user: { id: s.user.id, email: s.user.email ?? "" },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearCachedSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function signUp(email: string, password: string) {
  const { data, error } = await twin.auth.signUp({ email, password });
  if (error) throw error;
  if (data.session) setCachedSession(data.session);
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await twin.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data.session) setCachedSession(data.session);
  return data;
}

export async function signOut() {
  await twin.auth.signOut();
  clearCachedSession();
}

export async function refreshSession() {
  const cached = getCachedSession();
  if (!cached) return null;

  const { data, error } = await twin.auth.refreshSession({
    refresh_token: cached.refresh_token,
  });
  if (error || !data.session) {
    clearCachedSession();
    return null;
  }
  setCachedSession(data.session);
  return data.session;
}

export function getUser(): TwinSession["user"] | null {
  return getCachedSession()?.user ?? null;
}

export function getAccessToken(): string | null {
  return getCachedSession()?.access_token ?? null;
}
