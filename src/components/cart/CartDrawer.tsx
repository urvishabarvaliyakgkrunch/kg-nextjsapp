// src/components/cart/CartDrawer.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useTierBackfill } from "@/hooks/useTierBackfill";
import { formatPrice } from "@/lib/formatPrice";
import CartDrawerItem from "./CartDrawerItem";
import CartDrawerSkeleton from "./CartDrawerSkeleton";
import LinkPending from "@/components/ui/LinkPending";
import FreeShippingBar from "./FreeShippingBar";
import FrequentlyBoughtTogether from "./FrequentlyBoughtTogether";

const DISCLAIMER =
  "All products supplied strictly for laboratory and research use only. By checking out you confirm you are a qualified researcher aged 21+.";

export default function CartDrawer({ freeShippingMin }: { freeShippingMin: number }) {
  const hasMounted = useHasMounted();
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isDrawerOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const subtotal = useCart((s) => s.totalPrice());

  useTierBackfill();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        onClick={closeDrawer}
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed right-0 top-0 z-50 flex h-full w-[400px] max-w-full flex-col bg-white p-5 shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="mb-5 flex flex-shrink-0 justify-end">
          <button
            type="button"
            onClick={closeDrawer}
            className="text-[20px] leading-5 text-chip-text transition-colors hover:text-blue"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* The saved cart is read on the browser, so wait before saying it is empty */}
        {!hasMounted ? (
          <CartDrawerSkeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="font-mono text-[14px] text-ink-dark">
              Your cart is empty.
            </p>
            <button
              type="button"
              onClick={closeDrawer}
              className="text-[13px] font-semibold text-blue underline underline-offset-2"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div>
                <FreeShippingBar subtotal={subtotal} minimum={freeShippingMin} />

                <div className="pb-5">
                  {items.map((item) => (
                    <CartDrawerItem key={item.variationId} item={item} />
                  ))}
                </div>

                {/* Drawer shows the pre-discount subtotal only — coupons live on /cart */}
                <p className="mb-5 border-y border-ink-dark p-2.5 text-center font-mono text-[16px] font-semibold text-ink-dark">
                  <strong className="font-black">Subtotal:</strong> {formatPrice(subtotal)}
                </p>
              </div>

              <FrequentlyBoughtTogether />
            </div>

            <div className="flex-shrink-0 pt-5">
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="flex h-[34px] items-center justify-center bg-blue px-2.5 py-1.5 text-center font-mono text-[13px] font-medium leading-[22px] text-white transition-opacity hover:bg-black hover:text-[#fff]"
                >
                  View cart
                  <LinkPending />
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex h-[34px] items-center justify-center bg-ink-dark px-2.5 py-1.5 text-center font-mono text-[13px] font-medium leading-[22px] text-white transition-opacity hover:bg-blue hover:text-[#fff]"
                >
                  Checkout
                  <LinkPending />
                </Link>
              </div>

              <p className="mt-[15px] px-1 text-[12px] leading-[1.45] text-lot-body">
                {DISCLAIMER}
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
