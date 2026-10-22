// src/components/cart/CartPageClient.tsx
"use client";

import { useCart } from "@/store/cart";
import { useCartTotals } from "@/hooks/useCartTotals";
import { useCartLoyalty } from "@/hooks/useCartLoyalty";
import { useHasMounted } from "@/hooks/useHasMounted";
import CartItemsCard from "./CartItemsCard";
import CartPageSkeleton from "./CartPageSkeleton";
import CartSummary from "./CartSummary";
import CouponField from "./CouponField";
import EmptyCart from "./EmptyCart";
import LoyaltyBanner from "./LoyaltyBanner";
import RewardsBanner from "./RewardsBanner";

// Cart lives in localStorage, so the first paint must wait for the browser
export default function CartPageClient() {
  const hasMounted = useHasMounted();
  const items = useCart((s) => s.items);
  const localSubtotal = useCart((s) => s.totalPrice());
  const { totals, rejected, isLoading, isOffline, dataKey, refresh } = useCartTotals();
  // Asked only once pricing is done, because WordPress counts the cart it priced last
  const loyalty = useCartLoyalty(dataKey, items.length > 0 && !isLoading && !isOffline);

  // localStorage only exists in the browser, so hold the shape until we are there
  if (!hasMounted) return <CartPageSkeleton />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[560px]">
        <EmptyCart />
      </div>
    );
  }
  // 673 / 437 / 30px gap — measured on the live cart
  return (
    <div className="mx-auto grid max-w-[1140px] gap-[30px] lg:grid-cols-[minmax(0,1fr)_437px] lg:items-start">
      <div className="flex flex-col gap-[5px]">
        <LoyaltyBanner message={loyalty?.earnMessage ?? ""} />
        <RewardsBanner message={loyalty?.redeemMessage ?? ""} balance={loyalty?.balance ?? 0} />
        <CartItemsCard items={items} onUpdate={refresh} isUpdating={isLoading} />
        <div className="mt-[25px]">
          <CouponField rejected={rejected} isChecking={isLoading} />
        </div>
      </div>

      <CartSummary
        totals={totals}
        localSubtotal={localSubtotal}
        isLoading={isLoading}
        isOffline={isOffline}
      />
    </div>
  );
}
