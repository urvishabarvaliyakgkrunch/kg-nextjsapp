// src/lib/session.ts
// Reads and writes the signed-in cookie. Server-only — never import from a "use client" file.

import { cookies } from "next/headers";
import { readTokenExpiry } from "@/lib/jwt";
import { SESSION_COOKIE as CART_SESSION_COOKIE } from "@/lib/cartSession";
import type { Session } from "@/types/account";

export const SESSION_COOKIE = "elx_session";

// WordPress refresh tokens last a year, so the cookie should too
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;


export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.authToken || !parsed.refreshToken) return null;
    return {
      authToken: parsed.authToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt ?? readTokenExpiry(parsed.authToken),
      remember: parsed.remember ?? false,
    };
  } catch {
    return null;
  }
}

// The Woo cart session is opened for whoever was signed in at the time, so a
// sign-in or sign-out leaves it pointing at the wrong customer — and a coupon
// locked to an account is then refused when the cart is priced for checkout.
async function dropCartSession(): Promise<void> {
  (await cookies()).delete(CART_SESSION_COOKIE);
}

// Only callable from a Server Action or Route Handler — Next cannot set cookies while rendering
export async function saveSession(session: Session): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // No maxAge = a session cookie, which the browser drops when it closes
    ...(session.remember ? { maxAge: ONE_YEAR_SECONDS } : {}),
  });
  await dropCartSession();
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  await dropCartSession();
}
