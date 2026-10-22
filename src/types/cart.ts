// src/types/cart.ts

import type { LoyaltyCartPoints } from "@/types/loyalty";

// ── One bundle tier (1 / 2 / 3 Bottles) ──────────
// Stored on the cart line so the stepper can swap tiers without a new API call
export interface CartTier {
  variationId: number;
  label: string;
  price: number;
  regularPrice: number;
}

// ── Quantity rule for a simple product: min bottles and the % off each bottle ──
export interface QtyRule {
  min: number;
  percent: number;
}

// ── One line in the cart ─────────────────────────
export interface CartItem {
  variationId: number; // Tagada needs the variation, not the parent product
  productId: number;
  name: string;
  price: number;
  regularPrice?: number; // shown struck through when the product is on sale
  quantity: number;
  image: string;
  slug?: string;
  tiers?: CartTier[];
  // Simple products only: `price` is re-worked from these whenever quantity changes
  qtyRules?: QtyRule[];
  basePrice?: number; // one bottle at its active (sale) price, before the tier %
  maxQty?: number; // stock left; Woo refuses a line above this, so the cart never goes past it
}

// ── Totals calculated by WooCommerce (shadow cart) ──
export interface CouponLine {
  code: string;
  discount: number;
}

export interface ShippingRate {
  name: string; // "Flat rate"
  price: number;
  selected: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  coupons: CouponLine[];
  shipping: number;
  shippingName: string; // "Flat rate" — empty when Woo found no rate
  shippingState: string; // "NV" — Woo falls back to the store address for guests
  total: number;
}

// Codes Woo rejected, with the reason to show under the coupon field
export interface RejectedCoupon {
  code: string;
  message: string;
}

export interface CartTotalsResult {
  totals: CartTotals;
  rejected: RejectedCoupon[];
}

// What /api/cart/totals sends back. Loyalty travels with the price because WordPress counts
// points on the cart it just priced — null for a signed-out visitor or an unreachable backend.
export type CartTotalsResponse = CartTotalsResult;

// Points answer, fetched on its own so it never slows the price down
export interface CartLoyaltyResponse {
  loyalty: LoyaltyCartPoints | null;
}

// ── Frequently Bought Together ───────────────────
export interface FbtVariation {
  variationId: number;
  label: string; // raw attribute value shown in the dropdown, e.g. "1-vial"
  tierLabel: string; // cart wording for the same tier, e.g. "1 Bottle"
  price: number;
  regularPrice: number;
}

export interface FbtSuggestion {
  productId: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  variations: FbtVariation[]; // empty for simple products
  // Simple products only: the "was" price, tier rules and stock limit for the cart line
  regularPrice?: number;
  qtyTiers?: string | null;
  stockQuantity?: number | null;
  backorders?: string | null;
}
