// src/lib/bundle.ts
// Mirrors the WordPress "variation-code" snippet so Next.js renders identical tiers and savings.

import { parsePrice, roundCents } from "./formatPrice";
import type { BundleTier, ProductVariation } from "@/types/product";

const VIAL_ATTRIBUTE = "pa_mg";

// Sub-labels shown on the product page tier cards
const TIER_SUB: Record<string, string> = {
  "1-vial": "Single",
  "2-vial": "Pair",
  "3-vial": "Stack",
};

// Same as elx_parse_vials() in the rewards plugin: "2-vial" → 2, "3 Bottles" → 3
export function parseVials(slug: string): number {
  const match = /(\d+)/.exec(slug ?? "");
  return match ? parseInt(match[1], 10) : 0;
}

// Label is built from the number, like the plugin's _n('%d Bottle','%d Bottles')
export function tierMetaFor(
  slug: string,
  fallbackIndex = 0
): { label: string; sub: string; qty: number } {
  const parsed = parseVials(slug);
  const qty = parsed > 0 ? parsed : fallbackIndex + 1;
  return {
    label: `${qty} ${qty === 1 ? "Bottle" : "Bottles"}`,
    sub: TIER_SUB[slug] ?? "",
    qty,
  };
}

function tierSlug(variation: ProductVariation): string {
  const attr = variation.attributes?.nodes?.find(
    (a) => a.name === VIAL_ATTRIBUTE
  );
  return attr?.value ?? "";
}

export function buildBundleTiers(
  variations: ProductVariation[],
  basePrice: number
): BundleTier[] {
  // Woo serves variations newest-first; the snippet reads them cheapest-first
  const ordered = [...variations].sort(
    (a, b) => parsePrice(a.price) - parsePrice(b.price)
  );

  return ordered.map((variation, index) => {
    const slug = tierSlug(variation);
    const meta = tierMetaFor(slug, index);
    const total = parsePrice(variation.price);
    const undiscounted = basePrice * meta.qty;
    const savePct =
      undiscounted > total ? Math.ceil((1 - total / undiscounted) * 100) : 0;

    return {
      variationId: variation.databaseId,
      slug,
      label: meta.label,
      sub: meta.sub,
      qty: meta.qty,
      total,
      unit: roundCents(total / meta.qty),
      undiscounted,
      savePct,
      saved: roundCents(undiscounted - total),
      inStock: variation.stockStatus !== "OUT_OF_STOCK",
    };
  });
}

export function maxSavePct(tiers: BundleTier[]): number {
  return tiers.reduce((max, t) => (t.savePct > max ? t.savePct : max), 0);
}

