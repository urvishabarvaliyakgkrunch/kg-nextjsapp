// src/components/loyalty/CouponsPanel.tsx
"use client";

import { useRouter } from "next/navigation";
import CouponCard from "./CouponCard";
import CouponsEmpty from "./CouponsEmpty";
import Pager from "./Pager";
import { useLoyaltyPages } from "@/hooks/useLoyaltyPages";
import { useCart } from "@/store/cart";
import { useNotices } from "@/store/notices";
import type { LoyaltyCoupons } from "@/types/loyalty";

interface Props {
  kind: "active" | "expired";
  first: LoyaltyCoupons | null;
}

// The Coupons and Used & Expired tabs are the same list with a different filter
export default function CouponsPanel({ kind, first }: Props) {
  const { data, loading, goTo } = useLoyaltyPages(kind, first);
  const addCoupon = useCart((s) => s.addCoupon);
  const addNotice = useNotices((s) => s.addNotice);
  const router = useRouter();
  const items = data?.items ?? [];

  // Put the code on the cart and send the shopper there, so Woo prices it and
  // the discount is already on the order by the time Tagada takes over.
  // An empty cart still keeps the code: the store persists it, so the first
  // product added gets priced with the discount already on.
  function applyToCart(code: string) {
    addCoupon(code);
    if (useCart.getState().items.length === 0) {
      addNotice("Coupon will be applied once you add items to your cart.");
      return;
    }
    router.push("/cart");
  }

  if (items.length === 0) {
    return (
      <div className="mb-[35px] mt-[27px]">
        <CouponsEmpty kind={kind} />
      </div>
    );
  }

  // One full-width card per coupon, stacked, the way the live widget shows them
  return (
    <>
      <div className="mt-6 flex flex-col gap-4">
        {items.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            isExpired={kind === "expired"}
            onApply={kind === "expired" ? undefined : applyToCart}
          />
        ))}
      </div>
      {data && <Pager page={data.page} hasMore={data.hasMore} loading={loading} onGo={goTo} />}
    </>
  );
}
