// src/hooks/useTierBackfill.ts
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { fetchProductTiers } from "@/lib/cartApi";

// Without tiers the drawer stepper falls back to a free quantity box, which is
// exactly what the rewards plugin exists to prevent — so fill them in once.
export function useTierBackfill(): void {
  const items = useCart((s) => s.items);
  const applyTiers = useCart((s) => s.applyTiers);
  const [done, setDone] = useState<string>("");

  const missing = items
    .filter((i) => !i.tiers?.some((t) => t.variationId === i.variationId))
    .map((i) => i.productId);
  const key = [...new Set(missing)].sort().join(",");

  useEffect(() => {
    if (key === "" || key === done) return;

    const controller = new AbortController();
    fetchProductTiers(key.split(",").map(Number), controller.signal)
      .then((byProduct) => {
        setDone(key);
        if (Object.keys(byProduct).length > 0) applyTiers(byProduct);
      })
      .catch(() => {
        if (!controller.signal.aborted) setDone(key);
      });

    return () => controller.abort();
  }, [key, done, applyTiers]);
}
