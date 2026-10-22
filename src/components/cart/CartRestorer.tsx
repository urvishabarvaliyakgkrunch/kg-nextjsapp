// src/components/cart/CartRestorer.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { CART_RESTORE_DONE_HREF } from "@/lib/cartRecoveryCopy";
import type { RecoveredCart } from "@/types/cartRecovery";

interface Props {
  cart: RecoveredCart;
}

// Puts the emailed cart into the browser cart, then opens /cart.
// It renders nothing: the page's loading skeleton stays on screen until the redirect.
export default function CartRestorer({ cart }: Props) {
  const router = useRouter();

  useEffect(() => {
    // The email's discount is added as a code, so the normal cart pricing checks it
    useCart.getState().replaceCart(cart.lines, cart.coupon ? [cart.coupon] : []);
    // replace, not push, so the Back button does not bounce through this page again
    router.replace(CART_RESTORE_DONE_HREF);
  }, [cart, router]);

  return null;
}
