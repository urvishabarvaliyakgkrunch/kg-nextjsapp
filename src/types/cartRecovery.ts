// src/types/cartRecovery.ts

import type { CartItem } from "@/types/cart";

// One cart line as the browser sends it for saving. Names match what WordPress expects.
export interface CaptureLine {
  variation_id: number;
  quantity: number;
}

// A cart handed back by WordPress when someone clicks the link in a recovery email
export interface RecoveredCart {
  lines: CartItem[];
  // A discount code the recovery email offered, or null when it offered none
  coupon: string | null;
}
