// src/hooks/useHasMounted.ts
"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// Cart totals are restored from localStorage, so the first client render must match the server
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}
