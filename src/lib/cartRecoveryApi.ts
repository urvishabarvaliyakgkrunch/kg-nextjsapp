// src/lib/cartRecoveryApi.ts
// Browser-side calls to our own cart-recovery route. One place, so no component fetches directly.

import type { CartItem } from "@/types/cart";

// keepalive lets the request finish even if the shopper closes the tab right after
export async function saveCartForRecovery(items: CartItem[]): Promise<void> {
  await fetch("/api/cart-recovery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      lines: items.map((i) => ({
        variationId: i.variationId,
        quantity: i.quantity,
      })),
    }),
  });
}

export async function forgetCartForRecovery(): Promise<void> {
  await fetch("/api/cart-recovery", { method: "DELETE", keepalive: true });
}
