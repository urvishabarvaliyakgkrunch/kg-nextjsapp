// src/hooks/useCartLoyalty.ts
"use client";

import { useEffect, useState } from "react";
import { fetchCartLoyalty } from "@/lib/cartApi";
import {
  clearSessionCache,
  readSessionCache,
  writeSessionCache,
} from "@/lib/sessionCache";
import type { LoyaltyCartPoints } from "@/types/loyalty";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEY = "elx_cart_loyalty";

interface Answer {
  dataKey: string;
  loyalty: LoyaltyCartPoints | null;
}

/**
 * The two green banners. The last answer shows at once on a refresh, then WordPress is asked
 * again quietly, so the banners are never missing and never stale for long.
 *
 * `ready` is false until the cart has been priced: WordPress counts the cart it priced last,
 * so asking earlier would count the wrong one.
 */
export function useCartLoyalty(dataKey: string, ready: boolean): LoyaltyCartPoints | null {
  const [answer, setAnswer] = useState<Answer | null>(null);

  useEffect(() => {
    if (!ready) return;

    const controller = new AbortController();
    fetchCartLoyalty(controller.signal)
      .then((loyalty) => {
        setAnswer({ dataKey, loyalty });
        // A guest (null) must not leave an old shopper's banner behind
        if (loyalty) writeSessionCache(CACHE_KEY, dataKey, loyalty);
        else clearSessionCache(CACHE_KEY);
      })
      .catch(() => {
        // Aborted or offline — keep whatever is on screen
      });

    return () => controller.abort();
  }, [dataKey, ready]);

  // Newest answer for this cart wins; else the saved one; else the previous cart's (no blink)
  if (answer?.dataKey === dataKey) return answer.loyalty;
  const saved = readSessionCache<LoyaltyCartPoints>(CACHE_KEY, dataKey, CACHE_TTL_MS);
  return saved ?? answer?.loyalty ?? null;
}
