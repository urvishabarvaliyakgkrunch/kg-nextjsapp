// src/components/product/BundlePriceRow.tsx
"use client";

import { formatPrice } from "@/lib/formatPrice";
import type { BundleTier } from "@/types/product";

interface Props {
  tier: BundleTier;
  productName: string;
}

export default function BundlePriceRow({ tier, productName }: Props) {
  const isSingle = tier.qty === 1;
  const showStrike = tier.undiscounted > tier.total;

  return (
    <div className="mt-[18px] flex flex-wrap items-baseline gap-3">
      <span className="font-display text-[36px] font-bold leading-none tracking-[-0.025em] text-ink-dark">
        {formatPrice(tier.total)}
      </span>

      {showStrike && (
        <span className="font-mono text-[14px] text-muted line-through">
          {formatPrice(tier.undiscounted)}
        </span>
      )}

      {!isSingle && (
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-bundle-deep">
          Save {formatPrice(tier.saved)}
        </span>
      )}

      <p className="mt-1 w-full font-mono text-[12px] uppercase tracking-[0.1em] text-lot-body">
        {isSingle
          ? `1 bottle · ${productName}`
          : `${tier.qty} bottles · ${formatPrice(tier.unit)} each`}
      </p>
    </div>
  );
}