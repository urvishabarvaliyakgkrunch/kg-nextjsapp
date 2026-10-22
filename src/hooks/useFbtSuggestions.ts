// src/hooks/useFbtSuggestions.ts
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { fetchFbtSuggestions } from "@/lib/cartApi";
import type { FbtSuggestion } from "@/types/cart";

export interface FbtState {
  suggestions: FbtSuggestion[];
  isLoading: boolean;
}

interface Loaded {
  key: string;
  list: FbtSuggestion[];
}

// Runs on mount, not on drawer open: the first call warms the server-side
// catalog cache in the background, so the drawer opens with the list ready.
export function useFbtSuggestions(): FbtState {
  const items = useCart((s) => s.items);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  // Suggestions depend on which products are in the cart, not on their quantity
  const key = items.map((i) => i.productId).join(",");

  useEffect(() => {
    const controller = new AbortController();

    fetchFbtSuggestions(key.split(",").filter(Boolean).map(Number), controller.signal)
      .then((list) => setLoaded({ key, list }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setLoaded({ key, list: [] });
      });

    return () => controller.abort();
  }, [key]);

  const fresh = loaded?.key === key ? loaded : null;

  return {
    suggestions: fresh?.list ?? [],
    isLoading: items.length > 0 && fresh === null,
  };
}
