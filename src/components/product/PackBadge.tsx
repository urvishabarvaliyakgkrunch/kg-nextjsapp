// src/components/product/PackBadge.tsx
"use client";

import { formatPrice } from "@/lib/formatPrice";
import type { BundleTier } from "@/types/product";

export default function PackBadge({ tier }: { tier: BundleTier }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-[14px] text-chip-text">
      <span>
        {formatPrice(tier.unit)} <small className="text-[0.8em]">/ each</small>
      </span>
      {tier.savePct > 0 && (
        <strong className="rounded-btn bg-save px-2 py-0.5 font-bold text-white">
          SAVE {tier.savePct}%
        </strong>
      )}
    </div>
  );
}