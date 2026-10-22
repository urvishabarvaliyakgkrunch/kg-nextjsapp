// src/lib/qtyTiers.ts
// Quantity-tier pricing for SIMPLE products. WordPress (Elixser Quantity Discount plugin) decides
// the rules and sends them as "3:10, 6:15, 12:20" (3+ bottles 10% off ...) in the product query
// already made for the page, so this adds no request.
//
// The tier % comes off the product's ACTIVE price (its sale price when it has one), and the
// "was" price is the regular price: regular 140, sale 70, 3 bottles = 70 - 10% = 63 each.
// WordPress still prices the real cart; this is only what the shopper sees before checkout.

import { roundCents } from "./formatPrice";
import type { BundleTier } from "@/types/product";
import type { QtyRule } from "@/types/cart";

// "3:10, 6:15" → [{min:3,percent:10},{min:6,percent:15}], lowest quantity first.
// Anything malformed is dropped, so a typo in WordPress shows no tier rather than a wrong one.
export function parseQtyRules(raw?: string | null): QtyRule[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => part.split(":").map((n) => parseFloat(n.trim())))
    .filter(
      ([min, percent]) =>
        Number.isInteger(min) && min > 1 && percent > 0 && percent < 100
    )
    .map(([min, percent]) => ({ min, percent }))
    .sort((a, b) => a.min - b.min);
}

// The best rule that applies at this quantity (highest min that is still <= qty)
export function percentFor(rules: QtyRule[], qty: number): number {
  let percent = 0;
  for (const rule of rules) if (qty >= rule.min) percent = rule.percent;
  return percent;
}

// Price of ONE bottle at this quantity, from the active price
export function unitPriceFor(active: number, rules: QtyRule[], qty: number): number {
  return roundCents(active * (1 - percentFor(rules, qty) / 100));
}

// Product-page cards: the same BundleTier shape the variable products use, so the existing
// cards, price row and badge render unchanged. Always starts at 1 bottle.
// savePct is the TOTAL saving against the regular price (sale + tier together).
export function buildQtyTiers(
  productId: number,
  regular: number,
  active: number,
  rules: QtyRule[],
  inStock: boolean
): BundleTier[] {
  return [1, ...rules.map((r) => r.min)].map((qty) => {
    const unit = unitPriceFor(active, rules, qty);
    const undiscounted = roundCents(regular * qty);
    const total = roundCents(unit * qty);

    return {
      variationId: productId, // a simple product's own id is what Woo and Tagada price
      slug: `${qty}`,
      label: `${qty} ${qty === 1 ? "Bottle" : "Bottles"}`,
      sub: "",
      qty,
      total,
      unit,
      undiscounted,
      savePct: undiscounted > total ? Math.ceil((1 - total / undiscounted) * 100) : 0,
      saved: roundCents(undiscounted - total),
      inStock,
    };
  });
}
