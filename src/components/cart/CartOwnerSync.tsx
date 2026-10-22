// src/components/cart/CartOwnerSync.tsx
"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

interface Props {
  // WordPress user id of whoever the cookie says is signed in, "" for a guest
  ownerKey: string;
}

// The cart lives in this browser, not in the account, so a second person
// signing up or signing in on the same browser would otherwise walk into the
// previous shopper's cart. Renders nothing — it only watches who is signed in.
export default function CartOwnerSync({ ownerKey }: Props) {
  useEffect(() => {
    useCart.getState().syncOwner(ownerKey);
  }, [ownerKey]);

  return null;
}
