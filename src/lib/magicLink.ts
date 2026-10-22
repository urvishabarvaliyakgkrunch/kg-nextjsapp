// src/lib/magicLink.ts
// Talks to the Elixser magic-link REST routes on WordPress (§A8 — documented in CLAUDE.md).
// The token is minted and checked by WordPress; Next.js only carries it.

import { readTokenExpiry } from "@/lib/jwt";
import type { Session } from "@/types/account";

// WordPress sends the mail inside this request, so a stuck SMTP server can stall it
const TIMEOUT_MS = 30_000;

const BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/elx/v1`;

interface RequestResult {
  ok: boolean;
  message: string;
}

// WordPress answers with the same wording the live site already uses
export async function requestMagicLink(email: string): Promise<RequestResult> {
  const res = await fetch(`${BASE}/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const json = (await res.json().catch(() => null)) as
    | { message?: string }
    | null;

  return {
    ok: res.ok,
    message:
      json?.message ??
      (res.ok
        ? "If this account exists, a sign-in link has been sent to your email."
        : "Something went wrong. Please try again."),
  };
}

// Asks WordPress if a password reset link can still be used (it only looks, never uses it up).
// If WordPress cannot answer (plugin not updated yet, network error), we say "yes, valid" so a
// real reset is never blocked by a failed check — the final reset step still checks the key.
export async function isResetLinkValid(key: string, login: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/password-reset/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, login }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return true;

    const json = (await res.json().catch(() => null)) as { valid?: boolean } | null;
    // Only an explicit "false" counts as expired
    return json?.valid !== false;
  } catch {
    return true;
  }
}

// One-time token in, JWT pair out — WordPress burns the token on first use
export async function verifyMagicLink(token: string): Promise<Session> {
  const res = await fetch(`${BASE}/magic-link/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const json = (await res.json().catch(() => null)) as
    | { authToken?: string; refreshToken?: string }
    | null;

  if (!res.ok || !json?.authToken || !json.refreshToken) {
    throw new Error("This sign-in link is invalid or has expired.");
  }

  return {
    authToken: json.authToken,
    refreshToken: json.refreshToken,
    expiresAt: readTokenExpiry(json.authToken),
    // They opened the link from their own inbox — keep them signed in
    remember: true,
  };
}
