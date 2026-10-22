// src/components/product/QtyRowCard.tsx
"use client";

import { formatPrice } from "@/lib/formatPrice";
import type { BundleTier } from "@/types/product";

interface Props {
  tier: BundleTier;
  active: boolean;
  onSelect: (tier: BundleTier) => void;
}

// Points shoppers to the quantity most of them pick
const ROW_TAG: Record<number, string> = { 3: "Best value" };

// One full-width row per quantity for simple products: radio, label, was-price, bold per-bottle
// price, and a SAVE badge on the top edge. Active tint and hover follow the variable cards.
export default function QtyRowCard({ tier, active, onSelect }: Props) {
  const regularUnit = tier.undiscounted / tier.qty;
  const showStrike = regularUnit > tier.unit;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(tier)}
      className={`relative flex w-full cursor-pointer appearance-none items-center justify-between gap-3 rounded-[14px] border-2 px-3.5 py-3 text-left outline-none transition-all duration-300 ease-out md:px-4 md:py-3.5 ${
        active
          ? "border-bundle bg-[rgba(0,102,255,0.06)] shadow-[0_6px_18px_rgba(0,102,255,0.14)]"
          : "border-line bg-white hover:border-bundle hover:bg-[rgba(0,102,255,0.03)]"
      }`}
    >
      {tier.savePct > 0 && (
        <span className="absolute -top-2.5 right-3 rounded-[4px] bg-bundle px-2 py-[3px] font-mono text-[10px] font-bold uppercase leading-none tracking-[0.1em] text-white md:right-4">
          Save {tier.savePct}%
        </span>
      )}

      <span className="flex min-w-0 items-center gap-3">
        {/* Radio: a filled blue dot with a tick once chosen */}
        <span
          aria-hidden="true"
          className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            active ? "border-bundle bg-bundle" : "border-line bg-white"
          }`}
        >
          {active && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6.2l2.4 2.4 4.6-5"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        <span className="font-display text-[17px] font-bold leading-tight tracking-[-0.02em] text-ink-dark md:text-[19px]">
          {tier.label}
        </span>

        {ROW_TAG[tier.qty] && (
          <span className="rounded-[4px] bg-ink-dark px-2 py-[3px] font-mono text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white">
            {ROW_TAG[tier.qty]}
          </span>
        )}
      </span>

      <span className="flex flex-shrink-0 items-baseline gap-2 whitespace-nowrap">
        {showStrike && (
          <span className="font-display text-[13px] text-muted line-through md:text-[15px]">
            {formatPrice(regularUnit)}
          </span>
        )}
        <span className="font-display text-[22px] font-bold leading-none tracking-[-0.02em] text-ink-dark md:text-[26px]">
          {formatPrice(tier.unit)}
        </span>
        <span className="font-mono text-[11px] tracking-[0.04em] text-muted md:text-[12px]">
          / bottle
        </span>
      </span>
    </button>
  );
}
