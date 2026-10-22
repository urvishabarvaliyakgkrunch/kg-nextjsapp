// src/components/tracking/TagadaReturn.tsx
"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { RETURN_PARAM, RETURN_VALUE } from "@/lib/tagada/config";
import { clearHandoff } from "@/lib/tagada/handoff";

// A shopper who paid comes back carrying our own marker on the URL. That is
// the only signal this site gets that the order went through, so the cart is
// emptied here. The marker is then taken off the URL, or a later refresh would
// clear a cart the shopper has since refilled.
export default function TagadaReturn() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(RETURN_PARAM) !== RETURN_VALUE) return;

    useCart.getState().clearCart();
    // This tab is done with that checkout, so the next one starts clean
    clearHandoff();

    url.searchParams.delete(RETURN_PARAM);
    window.history.replaceState({}, "", url.toString());
  }, []);

  return null;
}
