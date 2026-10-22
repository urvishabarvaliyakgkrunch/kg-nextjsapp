// src/hooks/useCartTotals.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { fetchCartTotals } from "@/lib/cartApi";
import { readSessionCache, writeSessionCache } from "@/lib/sessionCache";
import type { CartTotals, RejectedCoupon } from "@/types/cart";

const DEBOUNCE_MS = 250;
// A repeat visit within this window reuses the last Woo answer instead of re-pricing
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEY = "elx_cart_priced";

export interface CartTotalsState {
  totals: CartTotals | null;
  rejected: RejectedCoupon[];
  isLoading: boolean;
  isOffline: boolean; // backend unreachable — page shows the local subtotal instead
  // Identifies this exact cart + codes; the points hook uses it to know what it is asking about
  dataKey: string;
  refresh: () => void; // "Update Cart" — re-price against Woo on demand
}

interface Priced {
  key: string;
  totals: CartTotals | null;
  isOffline: boolean;
}

// Asks WooCommerce to price the cart whenever lines or coupon codes change.
// Debounced so holding the +/- stepper does not fire a request per click.
export function useCartTotals(): CartTotalsState {
  const items = useCart((s) => s.items);
  const couponCodes = useCart((s) => s.couponCodes);
  const removeCoupon = useCart((s) => s.removeCoupon);

  const [reloadKey, setReloadKey] = useState(0);
  const [priced, setPriced] = useState<Priced | null>(null);
  // Woo rejects a code, we drop it, which triggers a fresh price — so the reason
  // is kept here instead of in that next (empty) answer
  const [lastRejected, setLastRejected] = useState<RejectedCoupon[]>([]);

  const refresh = useCallback(() => setReloadKey((n) => n + 1), []);

  // Same cart + codes, ignoring "Update Cart" clicks — what the cache is keyed on
  const dataKey = JSON.stringify([
    items.map((i) => [i.variationId, i.quantity]),
    couponCodes,
  ]);
  // Identifies exactly what was priced, so an answer for an older cart is ignored
  const key = `${dataKey}|${reloadKey}`;

  // "Update Cart" (reloadKey > 0) must always re-price, so it skips the cache
  const cachedTotals =
    reloadKey === 0 && items.length > 0
      ? readSessionCache<CartTotals>(CACHE_KEY, dataKey, CACHE_TTL_MS)
      : null;

  const dropRejected = useCallback(
    (rejected: RejectedCoupon[]) => {
      // Woo said no, so stop sending the code on every later request
      rejected.forEach((r) => removeCoupon(r.code));
    },
    [removeCoupon]
  );

  useEffect(() => {
    if (items.length === 0) return;
    if (reloadKey === 0 && readSessionCache(CACHE_KEY, dataKey, CACHE_TTL_MS)) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchCartTotals(items, couponCodes, controller.signal)
        .then((result) => {
          setPriced({ key, totals: result.totals, isOffline: false });
          if (result.rejected.length > 0) {
            setLastRejected(result.rejected);
            dropRejected(result.rejected);
          } else {
            writeSessionCache(CACHE_KEY, dataKey, result.totals);
          }
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setPriced({ key, totals: null, isOffline: true });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, dataKey, reloadKey, items, couponCodes, dropRejected]);

  const live = priced?.key === key ? priced : null;
  const fresh: Priced | null =
    live ?? (cachedTotals ? { key, totals: cachedTotals, isOffline: false } : null);

  return {
    // Keep the last known totals on screen while re-pricing, so the box never empties
    totals: fresh?.totals ?? priced?.totals ?? null,
    rejected: lastRejected,
    isLoading: items.length > 0 && fresh === null,
    isOffline: fresh?.isOffline ?? false,
    dataKey,
    refresh,
  };
}
