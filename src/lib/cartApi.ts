// src/lib/cartApi.ts
// Browser-side calls to our own cart routes. One place, so no component fetches directly.

import type { LoyaltyCartPoints } from "@/types/loyalty";
import type {
  CartItem,
  CartLoyaltyResponse,
  CartTier,
  CartTotalsResponse,
  FbtSuggestion,
} from "@/types/cart";

export async function fetchCartTotals(
  items: CartItem[],
  codes: string[],
  signal?: AbortSignal
): Promise<CartTotalsResponse> {
  const res = await fetch("/api/cart/totals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      lines: items.map((i) => ({
        variationId: i.variationId,
        quantity: i.quantity,
      })),
      codes,
    }),
  });

  if (!res.ok) throw new Error("Could not price the cart.");
  return (await res.json()) as CartTotalsResponse;
}

// Points for the cart WordPress priced last. null = guest, or WordPress said nothing.
export async function fetchCartLoyalty(
  signal?: AbortSignal
): Promise<LoyaltyCartPoints | null> {
  const res = await fetch("/api/cart/loyalty", { signal, cache: "no-store" });
  if (!res.ok) return null;
  return ((await res.json()) as CartLoyaltyResponse).loyalty;
}

// Asks our server for the TagadaPay checkout URL. Nothing is ordered here —
// the order only exists once the shopper pays on Tagada's page.
export async function startTagadaCheckout(
  items: CartItem[],
  codes: string[]
): Promise<string> {
  const res = await fetch("/api/tagada/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lines: items.map((i) => ({
        variationId: i.variationId,
        quantity: i.quantity,
      })),
      codes,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "Could not start checkout.");
  }
  return data.url;
}

export async function fetchFbtSuggestions(
  productIds: number[],
  signal?: AbortSignal
): Promise<FbtSuggestion[]> {
  const res = await fetch("/api/cart/fbt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ productIds }),
  });

  if (!res.ok) return [];
  const data = (await res.json()) as { suggestions?: FbtSuggestion[] };
  return data.suggestions ?? [];
}

export async function fetchProductTiers(
  productIds: number[],
  signal?: AbortSignal
): Promise<Record<number, CartTier[]>> {
  const res = await fetch("/api/cart/tiers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ productIds }),
  });

  if (!res.ok) return {};
  const data = (await res.json()) as { tiers?: Record<number, CartTier[]> };
  return data.tiers ?? {};
}
