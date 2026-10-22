// src/lib/cartSession.ts
// Server-only. The cookie that remembers one shopper's WooCommerce cart session.

import type { StoreSession } from "@/lib/coupon";

export const SESSION_COOKIE = "elx_cart_session";
// Woo nonces last ~12h, refresh well before that
export const SESSION_MAX_AGE = 60 * 60 * 6;

// Cookie holds "<nonce>|<cart-token>" so a repeat visitor skips the opening GET
export function readSession(request: Request): StoreSession | null {
  const raw = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!raw) return null;

  const [nonce, token] = decodeURIComponent(raw).split("|");
  return nonce && token ? { nonce, token } : null;
}
