// src/lib/tagada/pricing.ts
// Server-only. Turns a priced WooCommerce cart into the discount, fee and
// shipping fields Tagada expects. This is the port of the plugin's
// tgd_build_dynamic_promotions / tgd_build_custom_order_bumps /
// tgd_build_external_shipping / tgd_compute_wc_catchall_delta helpers.

import type { StoreCart } from "@/types/storeCart";
import type {
  TagadaOrderBump,
  TagadaPromotion,
  TagadaShipping,
} from "@/types/tagada";
import { toMoney } from "../storeCart";

// The code the plugin stamps on the leftover-discount entry. Tagada treats it
// as a plain amount and never tries to match it to a real promotion.
const CATCHALL_CODE = "wc_total_reconciliation";

// PHP's round($value, 2) — plain toFixed drifts on halfway values
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Positive Woo cart fees become Tagada order bumps. Amounts stay in MAJOR
// units and ex-tax, which is what the plugin sends.
export function buildOrderBumps(cart: StoreCart): TagadaOrderBump[] {
  const minor = cart.totals.currency_minor_unit ?? 2;
  const currency = cart.totals.currency_code;

  return (cart.fees ?? [])
    .map((fee) => ({
      name: fee.name || "Order Bump",
      amount: toMoney(fee.totals?.total, minor),
      currency,
      quantity: 1,
    }))
    .filter((bump) => bump.amount > 0);
}

/**
 * Shipping Woo actually settled on, in MINOR units.
 *
 * Returns null unless Woo really calculated it. That distinction is the whole
 * point: a cart whose shipping was never worked out still reports 0, and
 * forwarding that 0 would pin a FREE rate on the Tagada session and hide the
 * real rate. Sending nothing lets Tagada pick instead. Once Woo HAS calculated
 * and picked a rate, a 0 is genuine free shipping and is forwarded, so a
 * shopper who earned free shipping is not charged again at checkout.
 */
export function buildExternalShipping(cart: StoreCart): TagadaShipping | null {
  if (!cart.needs_shipping) return null;
  if (!cart.has_calculated_shipping) return null;

  const chosen = (cart.shipping_rates ?? []).some((pkg) =>
    (pkg.shipping_rates ?? []).some((rate) => rate.selected)
  );
  if (!chosen) return null;

  const amount = parseInt(cart.totals.total_shipping ?? "0", 10);
  if (!Number.isFinite(amount) || amount < 0) return null;

  return { amount, currency: cart.totals.currency_code };
}

/**
 * The leftover discount Woo applied that no coupon line accounts for.
 *
 * WooCommerce can cut a price in four unrelated ways: coupons, total filters,
 * fees, and product-price filters. The coupon loop below covers the first.
 * This fills the gap for the rest — on this store that is Discount Rules and
 * the quantity-pricing plugin, which rewrite the line price directly.
 *
 *   baseline  = catalogue price x qty, summed   (what Tagada will charge)
 *   net       = what Woo charges for products only
 *   gap       = baseline - already forwarded - net
 *
 * Subtracting what is already forwarded is what stops a coupon being applied
 * twice. Returns null when there is nothing left to forward.
 */
export function computeCatchallDelta(
  cart: StoreCart,
  catalogPrices: Map<number, number>,
  forwarded: TagadaPromotion[],
  bumpsTotal: number
): number | null {
  const minor = cart.totals.currency_minor_unit ?? 2;

  let baseline = 0;
  for (const item of cart.items ?? []) {
    const qty = Number(item.quantity) || 0;
    if (qty <= 0) continue;

    const lineSubtotal = toMoney(item.totals?.line_subtotal, minor);
    // No catalogue price (grouped or price-less variation) — fall back to what
    // the line itself cost per unit. That misses price-filter discounts for
    // this line but never invents one.
    const unit = catalogPrices.get(item.id) ?? (qty > 0 ? lineSubtotal / qty : 0);
    if (unit <= 0) continue;

    baseline += unit * qty;
  }

  // Fees ride along as separate Tagada line items, so take them out here or
  // the gap under-counts by the whole fee whenever a real discount also exists
  const net =
    toMoney(cart.totals.total_price, minor) -
    toMoney(cart.totals.total_tax, minor) -
    toMoney(cart.totals.total_shipping, minor) -
    bumpsTotal;

  const already = forwarded.reduce((sum, entry) => sum + entry.amount, 0);
  const gap = round2(baseline - already - net);

  if (gap < 0.01) return null;

  // Tagada applies this amount unchecked, so a gap close to the whole cart is
  // far more likely to be a bad read than a real discount — drop it rather
  // than hand the shopper a free order
  if (baseline <= 0 || gap > baseline * 0.95) return null;

  return gap;
}

// Every discount Woo computed, as Tagada promotion entries. Sending the amount
// means a code created seconds ago still works without a Tagada-side sync.
export function buildDynamicPromotions(
  cart: StoreCart,
  catalogPrices: Map<number, number>,
  bumpsTotal: number
): TagadaPromotion[] {
  const minor = cart.totals.currency_minor_unit ?? 2;
  const currency = cart.totals.currency_code;
  if (!currency) return [];

  const entries: TagadaPromotion[] = (cart.coupons ?? [])
    .map((coupon) => ({
      code: coupon.code,
      amount: toMoney(coupon.totals?.total_discount, minor),
      currency,
    }))
    .filter((entry) => entry.amount > 0);

  const delta = computeCatchallDelta(cart, catalogPrices, entries, bumpsTotal);
  if (delta !== null) {
    entries.push({ code: CATCHALL_CODE, amount: delta, currency });
  }

  return entries;
}

export function sumBumps(bumps: TagadaOrderBump[]): number {
  return bumps.reduce((sum, bump) => sum + bump.amount * (bump.quantity || 1), 0);
}
