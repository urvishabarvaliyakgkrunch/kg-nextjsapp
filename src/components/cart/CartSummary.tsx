// src/components/cart/CartSummary.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useNotices } from "@/store/notices";
import { formatPrice } from "@/lib/formatPrice";
import Skeleton from "@/components/ui/Skeleton";
import LinkPending from "@/components/ui/LinkPending";
import type { CartTotals } from "@/types/cart";

interface Props {
  totals: CartTotals | null;
  localSubtotal: number; // used until Woo answers, so the box is never blank
  isLoading: boolean;
  isOffline: boolean;
}

const ROW = "flex items-baseline justify-between gap-3 pt-3 pb-[9px]";

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] font-normal text-blue transition-opacity hover:opacity-70"
    >
      [Remove]
    </button>
  );
}

export default function CartSummary({
  totals,
  localSubtotal,
  isLoading,
  isOffline,
}: Props) {
  const couponCodes = useCart((s) => s.couponCodes);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const addNotice = useNotices((s) => s.addNotice);

  // Woo prints this notice whenever a coupon leaves the cart
  const dropCoupon = (code: string) => {
    removeCoupon(code);
    addNotice("Coupon has been removed.");
  };

  const subtotal = totals?.subtotal ?? localSubtotal;
  const total = totals ? totals.total : localSubtotal;

  // Only show coupons the shopper still has, so Remove takes effect right away
  const active = new Set(couponCodes.map((c) => c.toLowerCase()));
  const applied = (totals?.coupons ?? []).filter((c) =>
    active.has(c.code.toLowerCase())
  );
  // Codes typed but not priced yet — shown straight away so Apply feels alive
  const priced = new Set(applied.map((c) => c.code.toLowerCase()));
  const pending = couponCodes.filter((c) => !priced.has(c.toLowerCase()));

  return (
    <aside className="border border-cart-line bg-white px-[30px] py-[16px]">
      <h2 className="mb-4 pb-2 font-mono text-[14px] leading-[16.8px] font-bold text-black">
        Cart Totals
      </h2>

      {/* Rows are 40px tall on the live cart: 12px above, 9px below */}
      <dl className="font-mono text-[12.6px] leading-[18.9px] font-bold text-ink-dark">
        <div className={ROW}>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>

        {applied.map((coupon) => (
          <div key={coupon.code} className={ROW}>
            <dt>{coupon.code}</dt>
            <dd className="flex items-baseline gap-1 whitespace-nowrap">
              -{formatPrice(coupon.discount)}
              <RemoveButton onClick={() => dropCoupon(coupon.code)} />
            </dd>
          </div>
        ))}

        {pending.map((code) => (
          <div key={code} className={ROW}>
            <dt>{code.toUpperCase()}</dt>
            <dd className="flex items-baseline gap-1 whitespace-nowrap font-normal text-muted">
              {/* Offline means Woo never answered, so "checking" would spin forever */}
              {isOffline ? "at checkout" : <>checking&hellip;</>}
              <RemoveButton onClick={() => dropCoupon(code)} />
            </dd>
          </div>
        ))}

        {totals && totals.shippingName && (
          <div className="flex flex-col pt-3 pb-[9px]">
            <dt className="mb-[10px]">Shipment</dt>
            <dd className="font-normal text-blue">
              {totals.shippingName}: {formatPrice(totals.shipping)}
            </dd>
            {totals.shippingState && (
              <dd className="mt-[6px] font-normal text-muted-ship">
                Shipping to {totals.shippingState}.
              </dd>
            )}
            {/* Address itself is collected on the Tagada checkout page */}
            <dd className="mt-[6.3px] font-normal">
              <Link
                href="/checkout"
                className="text-blue transition-opacity hover:opacity-70"
              >
                Change address
              </Link>
            </dd>
          </div>
        )}

        <div className={ROW}>
          <dt>Total</dt>
          <dd>{isLoading && !totals && pending.length > 0 ? "…" : formatPrice(total)}</dd>
        </div>
      </dl>

      {isOffline && (
        <p className="mt-3 font-mono text-[11px] text-muted">
          Shipping and discounts will be confirmed at checkout.
        </p>
      )}

      <Link
        href="/checkout"
        className="mt-5 flex items-center justify-center border-2 border-blue bg-blue p-[15px] font-mono text-[15px] leading-[15px] font-bold text-white transition-opacity hover:bg-white hover:text-blue transition-all"
      >
        Proceed to Checkout
        <LinkPending />
      </Link>
    </aside>
  );
}
