// src/components/tracking/CartRecoverySync.tsx
"use client";

import { useCartRecoverySync } from "@/hooks/useCartRecoverySync";

// Renders nothing. It only keeps the saved cart fresh for abandoned-cart emails.
export default function CartRecoverySync() {
  useCartRecoverySync();
  return null;
}
