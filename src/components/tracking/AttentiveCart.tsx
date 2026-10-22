// src/components/tracking/AttentiveCart.tsx
"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { buildAttentiveCart } from "@/lib/attentive";

// Keeps window.attn_cart in step with the shopping cart on every page.
// It renders nothing. It only copies the cart for Attentive to read.
export default function AttentiveCart() {
  const items = useCart((state) => state.items);

  useEffect(() => {
    // An empty cart removes the value, so Attentive never sees an old cart
    window.attn_cart = items.length > 0 ? buildAttentiveCart(items) : undefined;
  }, [items]);

  return null;
}
