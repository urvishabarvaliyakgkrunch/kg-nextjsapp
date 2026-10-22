// src/lib/cartItem.ts
// Builds a cart line from bundle tiers. One place, so the product page, the shop
// card and the FBT block all store the same shape.

import type { CartItem, CartTier, QtyRule } from "@/types/cart";
import { parseQtyRules } from "@/lib/qtyTiers";
import type { BundleTier } from "@/types/product";

export function toCartTiers(tiers: BundleTier[]): CartTier[] {
  return tiers.map((t) => ({
    variationId: t.variationId,
    label: t.label,
    price: t.total,
    regularPrice: t.undiscounted,
  }));
}

interface BuildArgs {
  tier: BundleTier;
  allTiers: BundleTier[];
  productId: number;
  productName: string;
  image: string;
  slug?: string;
}

export function buildCartItem({
  tier,
  allTiers,
  productId,
  productName,
  image,
  slug,
}: BuildArgs): CartItem {
  return {
    variationId: tier.variationId,
    productId,
    // Live site names the line "<product> - <tier>", keep it identical
    name: `${productName} - ${tier.label}`,
    price: tier.total,
    regularPrice: tier.undiscounted,
    quantity: 1, // each tier is its own variation, so a line is always one
    image,
    slug,
    tiers: toCartTiers(allTiers),
  };
}

interface BuildQtyArgs {
  tier: BundleTier;
  qtyRules: QtyRule[];
  basePrice: number; // active (sale) price of one bottle
  maxQty?: number;
  productId: number;
  productName: string;
  image: string;
  slug?: string;
}

// Simple product: one line, the chosen quantity, and the rules so the price follows quantity
export function buildQtyCartItem({
  tier,
  qtyRules,
  basePrice,
  maxQty,
  productId,
  productName,
  image,
  slug,
}: BuildQtyArgs): CartItem {
  return {
    variationId: productId,
    productId,
    name: productName,
    price: tier.unit, // per bottle at this quantity
    regularPrice: tier.undiscounted / tier.qty, // struck through, as on variable products
    quantity: tier.qty,
    image,
    slug,
    qtyRules,
    basePrice,
    maxQty,
  };
}

interface SimpleArgs {
  productId: number;
  name: string;
  image: string;
  slug?: string;
  active: number; // price now (sale price when on sale)
  regular: number; // struck-through "was" price
  qtyTiers?: string | null; // "3:10, 6:15" from the Quantity Discount plugin
  stockQuantity?: number | null;
  backorders?: string | null;
}

// One bottle of a simple product from a shop card, FBT or any quick-add, carrying the same tier
// rules and stock limit as the product page, so its price follows quantity in the cart
export function buildSimpleCartItem({
  productId,
  name,
  image,
  slug,
  active,
  regular,
  qtyTiers,
  stockQuantity,
  backorders,
}: SimpleArgs): CartItem {
  const rules = parseQtyRules(qtyTiers);
  const maxQty =
    backorders === "NO" && typeof stockQuantity === "number" ? stockQuantity : undefined;

  return {
    variationId: productId,
    productId,
    name,
    price: active,
    regularPrice: Math.max(regular, active),
    quantity: 1,
    image,
    slug,
    ...(rules.length > 0 ? { qtyRules: rules, basePrice: active } : {}),
    ...(maxQty ? { maxQty } : {}),
  };
}
