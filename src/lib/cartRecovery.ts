// src/lib/cartRecovery.ts
// Server-only. The only file that talks to the Elixser Cart Recovery plugin.
// Never import this from a "use client" file — it carries the shared secret.

import type { CartItem } from "@/types/cart";
import type { CaptureLine, RecoveredCart } from "@/types/cartRecovery";

const BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/elx/v1/cart-recovery`;
// Falls back to the loyalty secret so one value in wp-config.php can serve both plugins
const SECRET =
  process.env.ELX_CART_RECOVERY_SECRET ?? process.env.ELX_LOYALTY_SECRET ?? "";

// A slow backend must never hold the shopper up, so we give up quickly
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_LINES = 50;

// Cart lines come from the browser, so treat them as untrusted and keep only clean numbers
export function cleanLines(raw: unknown): CaptureLine[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .slice(0, MAX_LINES)
    .map((line: { variationId?: unknown; quantity?: unknown }) => ({
      variation_id: Number(line?.variationId),
      quantity: Number(line?.quantity),
    }))
    .filter(
      (l) =>
        Number.isInteger(l.variation_id) &&
        l.variation_id > 0 &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0
    );
}

// One request to the plugin. Any failure becomes null, because recovery is a bonus feature
async function call<T>(
  path: string,
  init: { method: "GET" | "POST"; body?: Record<string, unknown> }
): Promise<T | null> {
  if (!SECRET) return null;

  try {
    const res = await fetch(`${BASE}${path}`, {
      method: init.method,
      headers: {
        "Content-Type": "application/json",
        "X-Elx-Cart-Recovery-Secret": SECRET,
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      // A cart is personal and changes constantly, so never cache it
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// Saves the shopper's cart so WordPress can email them if they leave it behind
export async function captureCart(
  email: string,
  lines: CaptureLine[]
): Promise<boolean> {
  const result = await call<{ captured: boolean }>("/capture", {
    method: "POST",
    body: { email, lines },
  });
  return result?.captured ?? false;
}

// Called when the shopper empties their cart, so no reminder is sent for nothing
export async function forgetCart(email: string): Promise<void> {
  await call("/forget", { method: "POST", body: { email } });
}

// Reads the cart behind a recovery-email link. Null means expired, used or invalid.
export async function fetchRecoveredCart(
  token: string
): Promise<RecoveredCart | null> {
  const result = await call<{ lines?: CartItem[]; coupon?: string | null }>(
    `/restore?token=${encodeURIComponent(token)}`,
    { method: "GET" }
  );
  if (!result || !Array.isArray(result.lines) || result.lines.length === 0) {
    return null;
  }

  return { lines: result.lines, coupon: result.coupon ?? null };
}
