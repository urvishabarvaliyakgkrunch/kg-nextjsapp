// src/components/product/AddToCartTier.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { buildCartItem, buildQtyCartItem } from "@/lib/cartItem";
import type { BundleTier } from "@/types/product";
import type { QtyRule } from "@/types/cart";

interface Props {
  tier: BundleTier;
  allTiers: BundleTier[];
  qtyRules?: QtyRule[];
  basePrice?: number;
  maxQty?: number;
  productId: number;
  productName: string;
  image: string;
  slug?: string;
  label?: string;
  variant?: "blue" | "light";
}

export default function AddToCartTier({
  tier,
  allTiers,
  qtyRules,
  basePrice,
  maxQty,
  productId,
  productName,
  image,
  slug,
  label = "Add to cart",
  variant = "blue",
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      qtyRules && basePrice
        ? buildQtyCartItem({ tier, qtyRules, basePrice, maxQty, productId, productName, image, slug })
        : buildCartItem({ tier, allTiers, productId, productName, image, slug })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!tier.inStock}
      className={`w-full rounded-[3px] p-[15px] text-[18px] font-bold capitalize leading-[18px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === "light"
          ? "bg-white text-ink-dark"
          : "bg-blue text-white hover:bg-atc-hover"
      }`}
    >
      {!tier.inStock ? "Out of stock" : added ? "Added to cart" : label}
    </button>
  );
}