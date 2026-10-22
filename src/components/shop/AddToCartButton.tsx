// src/components/shop/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { parsePrice } from "@/lib/formatPrice";
import { tierMetaFor } from "@/lib/bundle";
import { buildSimpleCartItem } from "@/lib/cartItem";
import type { CartTier } from "@/types/cart";
import type { GQLProduct, GQLProductVariation } from "@/types";

function CartIcon() {
  return (
    <svg className="dvcb-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 16 16">
      <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708"></path>
  </svg>
  );
}

interface Props {
  product: GQLProduct;
  compactMobile?: boolean;
}

// Woo returns variations newest-first, but the card shows the cheapest tier —
// sort by price so quick-add puts the tier the shopper actually saw in the cart
function toTiers(
  variations: GQLProductVariation[],
  basePrice: number
): CartTier[] {
  return variations
    .filter((v) => v.stockStatus !== "OUT_OF_STOCK")
    .map((v, index) => {
      const vialSlug =
        v.attributes?.nodes.find((a) => a.name === "pa_mg")?.value ?? "";
      const { label, qty } = tierMetaFor(vialSlug, index);
      return {
        variationId: v.databaseId,
        label,
        price: parsePrice(v.price),
        regularPrice: basePrice * qty,
      };
    })
    .sort((a, b) => a.price - b.price);
}

export default function AddToCartButton({ product, compactMobile = false }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  // Mirrors the shortcode's disabled state. A variable product is buyable
  // while any variation is in stock; a simple product speaks for itself, and
  // an absent stockStatus (older queries) counts as in stock.
  const variations = product.variations?.nodes ?? [];
  const inStock =
    variations.length > 0
      ? variations.some((v) => v.stockStatus !== "OUT_OF_STOCK")
      : product.stockStatus !== "OUT_OF_STOCK";

  const handleAdd = () => {
    if (!inStock) return;

    // Compare-at price lives in the _kg_base_price meta, not in Woo's regularPrice
    const basePrice = parsePrice(
      product.metaData?.find((m) => m.key === "_kg_base_price")?.value ?? ""
    );
    const tiers = toTiers(product.variations?.nodes ?? [], basePrice);
    const first = tiers[0];

    // A simple product carries its quantity tiers and stock limit into the cart
    if (!first) {
      const active = parsePrice(product.price);
      addItem(
        buildSimpleCartItem({
          productId: product.databaseId,
          name: product.name,
          image: product.image?.sourceUrl ?? "",
          slug: product.slug,
          active,
          regular: Math.max(basePrice, parsePrice(product.regularPrice)),
          qtyTiers: product.elxQtyTiers,
          stockQuantity: product.stockQuantity,
          backorders: product.backorders,
        })
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
      return;
    }

    addItem({
      variationId: first?.variationId ?? product.databaseId,
      productId: product.databaseId,
      name: first ? `${product.name} - ${first.label}` : product.name,
      price: first?.price ?? parsePrice(product.price),
      regularPrice: first?.regularPrice ?? parsePrice(product.regularPrice),
      quantity: 1,
      image: product.image?.sourceUrl ?? "",
      slug: product.slug,
      tiers,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock}
      aria-label={
        inStock
          ? `Add ${product.name} to cart`
          : `${product.name} is out of stock`
      }
      className={`flex flex-shrink-0 items-center justify-center rounded-btn text-white transition-colors ${compactMobile ? "h-8 w-8 md:h-[40px] md:w-[40px]" : "h-[40px] w-[40px]"} ${
        inStock
          ? `cursor-pointer hover:bg-[#0A0A0A] ${added ? "bg-[#0A0A0A]" : "bg-[#3473FB]"}`
          : "cursor-not-allowed bg-[#bbb] opacity-60"
      }`}
    >
      {added ? (
        <svg className="dvcb-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 16 16">
        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708"></path>
    </svg>
      ) : (
        <CartIcon />
      )}
    </button>
  );
}
