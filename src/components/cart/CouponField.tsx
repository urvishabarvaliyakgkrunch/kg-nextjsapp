// src/components/cart/CouponField.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { useNotices } from "@/store/notices";
import Spinner from "@/components/ui/Spinner";
import type { RejectedCoupon } from "@/types/cart";

interface Props {
  rejected: RejectedCoupon[];
  isChecking: boolean;
}

// Cart page only (§Cart decisions #3) — the drawer shows no coupon field,
// exactly like the live site.
export default function CouponField({ rejected, isChecking }: Props) {
  const addCoupon = useCart((s) => s.addCoupon);
  const couponCodes = useCart((s) => s.couponCodes);
  const addNotice = useNotices((s) => s.addNotice);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState("");
  // Remembers which code we already announced, so re-pricing the cart for an
  // unrelated reason does not toast the same coupon twice
  const announced = useRef("");

  // Woo's message already names the code, so showing it is enough
  const error = rejected.find(
    (r) => r.code.toLowerCase() === pending.toLowerCase()
  );

  // Woo only prints "Coupon code applied successfully." once it has accepted
  // the code, so wait for pricing to settle. A rejected code is dropped from
  // the store by useCartTotals, so surviving the round trip means Woo took it.
  useEffect(() => {
    if (!pending || isChecking || error) return;
    if (announced.current.toLowerCase() === pending.toLowerCase()) return;
    const accepted = couponCodes.some(
      (c) => c.toLowerCase() === pending.toLowerCase()
    );
    if (!accepted) return;
    announced.current = pending;
    addNotice("Coupon code applied successfully.");
  }, [pending, isChecking, error, couponCodes, addNotice]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const clean = code.trim();
    if (!clean) return;
    // A fresh submit may be the same code re-applied after a Remove
    announced.current = "";
    setPending(clean);
    addCoupon(clean);
    setCode("");
  };

  return (
    <div className="border border-cart-line bg-white px-[30px] py-[16px]">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-[30px]">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code"
          aria-label="Coupon code"
          autoComplete="off"
          className="h-[50px] flex-1 rounded-chip bg-input-bg p-4 font-mono text-[14px] text-ink-dark outline-none placeholder:text-placeholder"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="h-[46px] w-full border-2 border-blue font-mono text-[14px] font-bold leading-[14px] text-blue transition-colors hover:bg-blue hover:text-white transition-all disabled:opacity-45 sm:w-[194px]"
        >
          {/* A spinning ring says "working on it" better than the word alone */}
          {isChecking && (
            <Spinner className="h-3.5 w-3.5 border-2" label="Checking coupon" />
          )}
          {isChecking ? "Checking…" : "Apply coupon"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 px-5 font-mono text-[12px] text-ink">
          {error.message}
        </p>
      )}
    </div>
  );
}
