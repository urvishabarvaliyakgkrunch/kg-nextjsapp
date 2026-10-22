// src/lib/attentive.ts
// The one home for everything Attentive (SMS marketing). No React in this file.
// This replaces the WordPress plugin, which only works on WordPress-rendered pages.

import type { CartItem } from "@/types";
import type {
  AttentiveCart,
  AttentiveProduct,
} from "@/types/attentive";

// Attentive's setup page may give the domain with a suffix, so strip it
const DOMAIN_SUFFIX = /\.(attn|att)\.tv$/i;

// The shop sells in US dollars only
const CURRENCY = "USD";

// Empty string means "not set up" and the script is never loaded
export const ATTENTIVE_DOMAIN = (process.env.NEXT_PUBLIC_ATTENTIVE_DOMAIN ?? "")
  .trim()
  .replace(DOMAIN_SUFFIX, "");

// The address of Attentive's script, or null when no domain is set
export function getAttentiveScriptUrl(): string | null {
  if (!ATTENTIVE_DOMAIN) return null;
  return `https://cdn.attn.tv/${ATTENTIVE_DOMAIN}/dtag.js`;
}

// Builds the product data Attentive wants on a product page
export function buildAttentiveProduct(input: {
  productId: number;
  name: string;
  type: string;
  price: number;
  image: string;
  // The variation shown first on the page. Null when the product has none.
  variationId: number | null;
}): AttentiveProduct {
  return {
    name: input.name,
    // WPGraphQL sends "VARIABLE"; the old plugin sent "variable", so keep that form
    category: input.type.toLowerCase(),
    productId: String(input.productId),
    price: { value: input.price.toFixed(2), currency: CURRENCY },
    productVariantId: input.variationId === null ? null : String(input.variationId),
    productImage: input.image,
    quantity: 1,
  };
}

// Builds the cart data Attentive wants. Prices are strings, like the plugin sent.
export function buildAttentiveCart(items: CartItem[]): AttentiveCart {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    products: items.map((item) => ({
      product_id: item.productId,
      variation_id: item.variationId,
      quantity: item.quantity,
      name: item.name,
      price: item.price.toFixed(2),
      image: item.image,
    })),
    cartTotal: total.toFixed(2),
  };
}
