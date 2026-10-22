// src/components/product/BundleCard.tsx
"use client";

import { formatPrice } from "@/lib/formatPrice";
import type { BundleTier } from "@/types/product";

interface Props {
  tier: BundleTier;
  active: boolean;
  onSelect: (tier: BundleTier) => void;
}

// Points shoppers to the bundles most people pick
const TIER_TAG: Record<number, string> = { 2: "Most popular", 3: "Best value" };

export default function BundleCard({ tier, active, onSelect }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(tier)}
      className={`relative grid w-full cursor-pointer appearance-none grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-card border px-2.5 py-4 text-left outline-none transition-all duration-300 ease-out md:block md:px-3 md:pb-3.5 md:pt-4 ${
        active
          ? "border-bundle bg-[rgba(0,102,255,0.06)] shadow-[0_0_0_1px_var(--color-bundle),0_6px_18px_rgba(0,102,255,0.14)]"
          : "border-line bg-white shadow-none hover:border-bundle hover:bg-[rgba(0,102,255,0.03)]"
      }`}
    >
      {TIER_TAG[tier.qty] && (
        <span className="absolute -top-2 left-2.5 z-[1] rounded-full bg-ink-dark px-2 py-[3px] font-mono text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white">
          {TIER_TAG[tier.qty]}
        </span>
      )}

      {/* Phone: badge | label | price, label centred on the card */}
      {tier.savePct > 0 ? (
        <span className="static justify-self-start whitespace-nowrap rounded-full bg-bundle px-2 py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)] md:absolute md:-top-2 md:right-2.5">
          Save {tier.savePct}%
        </span>
      ) : (
        <span className="md:hidden" />
      )}

      <span className="block whitespace-nowrap text-center font-display text-[15px] font-bold leading-none tracking-[-0.02em] text-ink-dark md:mb-1 md:text-left md:whitespace-normal md:text-[18px]">
        {tier.label}
      </span>

      <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted md:mb-3 md:block">
        {tier.sub}
      </span>

      <span className="block justify-self-end whitespace-nowrap font-display text-[15px] font-semibold leading-none text-ink-dark md:whitespace-normal md:text-[18px]">
        {formatPrice(tier.unit)}
        {tier.qty > 1 && (
          <span className="ml-1 font-mono text-[10px] tracking-[0.08em] text-muted">
            / Each
          </span>
        )}
      </span>
    </button>
  );
}
