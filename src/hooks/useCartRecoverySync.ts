// src/hooks/useCartRecoverySync.ts
"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/store/cart";
import {
  forgetCartForRecovery,
  saveCartForRecovery,
} from "@/lib/cartRecoveryApi";

// Wait for the shopper to stop clicking, so one burst of changes is one request
const SYNC_DELAY_MS = 3000;

// Keeps WordPress's copy of the cart in step with the browser cart.
// WordPress needs it to email shoppers who leave without paying.
export function useCartRecoverySync(): void {
  const items = useCart((state) => state.items);
  // What WordPress already has, written as "variation x quantity" pairs
  const lastSent = useRef("");
  // True once this tab has saved a cart, so an empty cart on page load sends nothing
  const hasSaved = useRef(false);

  useEffect(() => {
    const key = items.map((i) => `${i.variationId}x${i.quantity}`).join(",");
    // Nothing changed (for example tiers were filled in), so there is nothing to send
    if (key === lastSent.current) return;

    const timer = setTimeout(() => {
      lastSent.current = key;

      if (items.length > 0) {
        hasSaved.current = true;
        saveCartForRecovery(items).catch(() => {});
      } else if (hasSaved.current) {
        hasSaved.current = false;
        forgetCartForRecovery().catch(() => {});
      }
    }, SYNC_DELAY_MS);

    // A newer change replaces the waiting one. This also covers a paid order:
    // the return page empties the cart before the timer fires, so nothing is sent.
    return () => clearTimeout(timer);
  }, [items]);
}
