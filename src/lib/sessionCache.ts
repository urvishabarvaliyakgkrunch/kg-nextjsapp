// src/lib/sessionCache.ts
// Browser-only. A tiny "same answer as a minute ago" store, so a refresh does not wait on WordPress.

interface Entry<T> {
  dataKey: string;
  at: number;
  value: T;
}

// sessionStorage can throw (private mode, blocked data), so every touch is guarded

export function readSessionCache<T>(storageKey: string, dataKey: string, ttlMs: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    // An answer for a different cart, or an old one, must never be shown
    if (entry.dataKey !== dataKey || Date.now() - entry.at > ttlMs) return null;
    return entry.value;
  } catch {
    return null;
  }
}

export function writeSessionCache<T>(storageKey: string, dataKey: string, value: T) {
  try {
    const entry: Entry<T> = { dataKey, at: Date.now(), value };
    window.sessionStorage.setItem(storageKey, JSON.stringify(entry));
  } catch {
    // no cache is fine — the next visit just asks again
  }
}

export function clearSessionCache(storageKey: string) {
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // nothing to clear
  }
}
