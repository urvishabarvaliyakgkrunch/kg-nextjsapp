// src/lib/tagada/catalog.ts
// Server-only. Reads the plain catalogue price of each variation.
//
// Why this is a separate call: the cart's own `prices.price` is what the
// shopper pays AFTER Discount Rules / quantity pricing have run. Tagada's
// catalogue holds the unfiltered price, so the reconciliation below needs that
// unfiltered number — the plugin gets it by reloading a fresh WC_Product.

import type { StoreProductPrice } from "@/types/storeCart";
import { toMoney } from "../storeCart";

const BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/store/v1`;

// Catalogue prices change rarely, but a stale one skews the discount we send,
// so never cache them
async function fetchOne(variationId: number): Promise<[number, number] | null> {
  try {
    const res = await fetch(`${BASE}/products/${variationId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const product = (await res.json()) as StoreProductPrice;
    const minor = product.prices?.currency_minor_unit ?? 2;

    // Prefer the active price (the sale price when on sale) — that is the field
    // Tagada's WooCommerce importer stores
    let price = toMoney(product.prices?.price, minor);
    if (price <= 0) price = toMoney(product.prices?.regular_price, minor);

    return price > 0 ? [variationId, price] : null;
  } catch {
    return null;
  }
}

// Store API has no bulk endpoint for variations, so fetch them side by side.
// A cart is a handful of lines, so this stays one short round of requests.
export async function fetchCatalogPrices(
  variationIds: number[]
): Promise<Map<number, number>> {
  const unique = [...new Set(variationIds)].filter((id) => id > 0);
  const found = await Promise.all(unique.map(fetchOne));
  return new Map(found.filter((entry): entry is [number, number] => entry !== null));
}
