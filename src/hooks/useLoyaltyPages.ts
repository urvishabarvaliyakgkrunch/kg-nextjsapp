// src/hooks/useLoyaltyPages.ts
"use client";

import { useState } from "react";

interface Paged {
  page: number;
  hasMore: boolean;
}

// Holds the page the server rendered and swaps in others as the shopper clicks Prev / Next
export function useLoyaltyPages<T extends Paged>(
  kind: "history" | "active" | "expired",
  first: T | null
) {
  const [data, setData] = useState<T | null>(first);
  const [loading, setLoading] = useState(false);

  async function goTo(page: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty/list?kind=${kind}&page=${page}`);
      if (res.ok) setData((await res.json()) as T);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, goTo };
}
