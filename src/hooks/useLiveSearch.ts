// src/hooks/useLiveSearch.ts
"use client";

import { useEffect, useState } from "react";

// Wait for a short pause in typing so we do not call the server on every key
const DEBOUNCE_MS = 250;
// Shorter than this matches almost everything, so we do not search yet
const MIN_CHARS = 2;

interface Loaded<T> {
  key: string;
  data: T;
}

export interface LiveSearchState<T> {
  data: T;
  isLoading: boolean;
  // True once the typed text is long enough to search
  isActive: boolean;
}

// Shared by the header search and the COA search: debounce, cancel, and remember answers.
// `memory` is owned by each caller, so words already searched in this tab need no request.
export function useLiveSearch<T>(
  rawQuery: string,
  fetcher: (query: string, signal: AbortSignal) => Promise<T>,
  memory: Map<string, T>,
  empty: T
): LiveSearchState<T> {
  const query = rawQuery.trim().toLowerCase();
  const isActive = query.length >= MIN_CHARS;
  const [loaded, setLoaded] = useState<Loaded<T> | null>(null);

  useEffect(() => {
    // Cached words are read while rendering (below), so no request is needed
    if (!isActive || memory.has(query)) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetcher(query, controller.signal)
        .then((data) => {
          memory.set(query, data);
          setLoaded({ key: query, data });
        })
        .catch(() => {
          // An aborted request means the user typed more — a newer one is already on its way
          if (!controller.signal.aborted) setLoaded({ key: query, data: empty });
        });
    }, DEBOUNCE_MS);

    // Typing again cancels the waiting timer and any request still in flight
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isActive, fetcher, memory, empty]);

  // Results belong to one exact word; anything else means we are still waiting
  const data = !isActive
    ? undefined
    : (memory.get(query) ?? (loaded?.key === query ? loaded.data : undefined));

  return {
    data: data ?? empty,
    isLoading: isActive && data === undefined,
    isActive,
  };
}
