// src/components/product/BuyBox.tsx
"use client";

import { useState } from "react";
import BundleCard from "./BundleCard";
import QtyRowCard from "./QtyRowCard";
import BundlePriceRow from "./BundlePriceRow";
import AddToCartTier from "./AddToCartTier";
import PackBadge from "./PackBadge";
import TrustRow from "./TrustRow";
import ResearchUseBar from "./ResearchUseBar";
import EarnPointsLine from "./EarnPointsLine";
import { maxSavePct } from "@/lib/bundle";
import type { BundleTier } from "@/types/product";
import type { QtyRule } from "@/types/cart";

interface Props {
  tiers: BundleTier[];
  // Simple products: the rules and active price that turn the chosen card into a cart line
  qtyRules?: QtyRule[];
  basePrice?: number;
  maxQty?: number;
  productId: number;
  productName: string;
  image: string;
  slug: string;
  coaUrl: string;
  // The COA section further down the page; the trust line jumps to it
  hasCoaSection?: boolean;
  // WPLoyalty's earn message per variation id. Empty when WordPress could not be reached.
  pointsMessages?: Record<number, string>;
  heading?: string;
  subheading?: string;
}

// Live wording: "Earn up to N points." where N is what the biggest bundle earns. WPLoyalty sends a
// message per variation; the points-per-dollar rate is taken from whichever tier has one.
function upToPointsMessage(tiers: BundleTier[], messages: Record<number, string>): string {
  const rates = tiers
    .map((t) => {
      const pts = parseInt((messages[t.variationId]?.match(/\d[\d,]*/)?.[0] ?? "").replace(/,/g, ""), 10);
      return pts > 0 && t.total > 0 ? pts / t.total : 0;
    })
    .filter((r) => r > 0);
  if (rates.length === 0) return "";
  const top = Math.max(...tiers.map((t) => t.total));
  return `Earn up to ${Math.round(top * rates[0])} points.`;
}

export default function BuyBox({
  tiers,
  qtyRules,
  basePrice,
  maxQty,
  productId,
  productName,
  image,
  slug,
  coaUrl,
  hasCoaSection = false,
  pointsMessages = {},
  heading = "Select quantity",
  subheading = "Stock up. Stable for 24 months lyophilized at −20°C.",
}: Props) {
  const [selected, setSelected] = useState<BundleTier>(tiers[0]);

  const topSave = maxSavePct(tiers);

  return (
    <div id="buy-box" className="scroll-mt-28">
      <EarnPointsLine message={upToPointsMessage(tiers, pointsMessages)} />

      {/* Live .eb-box: 12px radius, no shadow, padding 22/20/18 */}
      <div className="relative rounded-[12px] border border-line bg-white px-5 pb-[18px] pt-[22px]">
        {topSave > 0 && (
          <span className="absolute -top-2.5 left-[18px] rounded-chip bg-bundle px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            Bundle &amp; Save up to {topSave}%
          </span>
        )}

        <h2 className="mb-1 font-display text-[18px] font-bold tracking-[-0.02em] text-ink-dark">
          {heading}
        </h2>
        <p className={`${qtyRules ? "mb-5" : "mb-4"} text-[13px] text-lot-body`}>{subheading}</p>

        <div
          role="radiogroup"
          aria-label={heading}
          // Simple products list one quantity per row; variable ones keep the 3-up cards
          className={`grid grid-cols-1 ${qtyRules ? "gap-3" : "gap-3.5 md:grid-cols-3 md:gap-2"}`}
        >
          {tiers.map((tier) =>
            qtyRules ? (
              <QtyRowCard
                // A simple product's rows share one id, so quantity tells them apart
                key={tier.qty}
                tier={tier}
                active={tier.qty === selected.qty}
                onSelect={setSelected}
              />
            ) : (
              <BundleCard
                key={tier.variationId}
                tier={tier}
                active={tier.variationId === selected.variationId}
                onSelect={setSelected}
              />
            )
          )}
        </div>
      </div>

      <BundlePriceRow tier={selected} productName={productName} />

      <div className="mt-5">
        <AddToCartTier
          tier={selected}
          allTiers={tiers}
          qtyRules={qtyRules}
          basePrice={basePrice}
          maxQty={maxQty}
          productId={productId}
          productName={productName}
          image={image}
          slug={slug}
        />
      </div>

      <div className="mt-2">
        <PackBadge tier={selected} />
      </div>

      {coaUrl && (
        <a
          href={coaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-[3px] border border-outline bg-white p-[25px] text-center text-[18px] font-medium leading-5 text-ink-dark transition-colors hover:bg-cream"
        >
          View Certificate of Analysis
        </a>
      )}

      <TrustRow coaAnchor={hasCoaSection} />
      <ResearchUseBar />
    </div>
  );
}
