// src/components/checkout/CheckoutRedirect.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { startTagadaCheckout } from "@/lib/cartApi";
import { clearHandoff, markHandoff, hasHandoff } from "@/lib/tagada/handoff";
import Spinner from "@/components/ui/Spinner";

// Hands the cart to TagadaPay and sends the shopper to its hosted checkout.
// There is no form here on purpose — address and payment are collected by
// Tagada, which is also where the order is created.
export default function CheckoutRedirect() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const couponCodes = useCart((s) => s.couponCodes);

  const [error, setError] = useState("");
  const started = useRef(false);

  // Coming back from Tagada means the shopper changed their mind, so show
  // them their cart. Sending them straight out again would trap them on a
  // page they cannot leave with the back button.
  const goBackToCart = useCallback(() => {
    started.current = true;
    clearHandoff();
    router.replace("/cart");
  }, [router]);

  // The back button usually restores this page from the browser's cache
  // instead of mounting it again, so the effect below never re-runs and the
  // spinner would sit there forever. This event is the only signal for it.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) goBackToCart();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [goBackToCart]);

  useEffect(() => {
    if (started.current) return;

    // Same page, but mounted fresh rather than restored from cache.
    // The ref is set before leaving: this effect runs again as soon as the
    // saved cart hydrates, and by then the flag is already cleared, so
    // without the ref that second run would start a checkout anyway.
    if (hasHandoff()) {
      started.current = true;
      goBackToCart();
      return;
    }

    if (items.length === 0) {
      // Zustand reads an empty cart on the first paint while localStorage is
      // still loading, so give it a tick before bouncing back
      const timer = setTimeout(() => {
        if (useCart.getState().items.length === 0) router.replace("/cart");
      }, 300);
      return () => clearTimeout(timer);
    }

    started.current = true;
    markHandoff();

    startTagadaCheckout(items, couponCodes)
      .then((url) => {
        window.location.href = url;
      })
      .catch((cause: Error) => {
        // Nothing was handed over, so let the shopper try again
        started.current = false;
        clearHandoff();
        setError(cause.message);
      });
  }, [items, couponCodes, router, goBackToCart]);

  if (error) {
    return (
      <div className="rounded-chip border border-line bg-white px-6 py-16 text-center">
        <p className="font-mono text-[14px] text-ink-dark">{error}</p>
        <Link
          href="/cart"
          className="mt-5 inline-block rounded-chip bg-blue px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-chip border border-line bg-white px-6 py-20 text-center">
      <Spinner />
      <p className="font-mono text-[14px] text-ink-dark">
        Taking you to secure checkout…
      </p>
      <p className="text-[12px] text-muted">Please do not close this window.</p>
    </div>
  );
}
