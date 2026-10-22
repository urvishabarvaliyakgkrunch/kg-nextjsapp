// src/components/cart/FbtItem.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/formatPrice";
import { buildSimpleCartItem } from "@/lib/cartItem";
import type { FbtSuggestion } from "@/types/cart";

interface Props {
  suggestion: FbtSuggestion;
}

// Dark card with a variation dropdown and an ADD button — same layout as the
// WordPress .fbt-item markup this replaces.
export default function FbtItem({ suggestion }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [selected, setSelected] = useState(
    suggestion.variations[0]?.variationId ?? suggestion.productId
  );
  const [added, setAdded] = useState(false);

  const variation = suggestion.variations.find(
    (v) => v.variationId === selected
  );

  const handleAdd = () => {
    if (!variation) {
      addItem(
        buildSimpleCartItem({
          productId: suggestion.productId,
          name: suggestion.name,
          image: suggestion.image,
          slug: suggestion.slug,
          active: suggestion.price,
          regular: suggestion.regularPrice ?? suggestion.price,
          qtyTiers: suggestion.qtyTiers,
          stockQuantity: suggestion.stockQuantity,
          backorders: suggestion.backorders,
        })
      );
      setAdded(true);
      return;
    }

    addItem({
      variationId: variation?.variationId ?? suggestion.productId,
      productId: suggestion.productId,
      // Cart wording stays "1 Bottle" even though the dropdown shows Woo's "1-vial"
      name: variation
        ? `${suggestion.name} - ${variation.tierLabel}`
        : suggestion.name,
      price: variation?.price ?? suggestion.price,
      regularPrice: variation?.regularPrice,
      quantity: 1,
      image: suggestion.image,
      slug: suggestion.slug,
      tiers: suggestion.variations.map((v) => ({
        variationId: v.variationId,
        label: v.tierLabel,
        price: v.price,
        regularPrice: v.regularPrice,
      })),
    });
    setAdded(true);
  };

  return (
    <div className="flex h-[72px] flex-shrink-0 items-center gap-2.5 overflow-hidden rounded-r-[10px] bg-dark pr-2.5">
      <Link
        href={`/product/${suggestion.slug}`}
        className="h-[72px] w-[72px] flex-shrink-0"
      >
        {suggestion.image ? (
          <Image
            src={suggestion.image}
            alt={suggestion.name}
            width={72}
            height={72}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span className="block h-full w-full bg-muted-alt" aria-hidden="true" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-2.5">
        <Link
          href={`/product/${suggestion.slug}`}
          className="truncate text-[13px] font-bold text-white transition-colors hover:text-gray-light"
        >
          {suggestion.name}
        </Link>

        {suggestion.variations.length > 0 && (
          <select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            aria-label={`Bundle size for ${suggestion.name}`}
            className="w-full cursor-pointer rounded-btn border border-[#333] bg-[#1e1e1e] px-2 py-[5px] text-[11px] text-white outline-none focus:border-[#555]"
          >
            {suggestion.variations.map((v) => (
              <option key={v.variationId} value={v.variationId}>
                {v.label} — {formatPrice(v.price)}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={added}
        className={` flex-shrink-0 rounded-btn px-4 py-2.5 text-[11px] bg-[#2e7d32] font-bold uppercase tracking-[0.06em] transition-colors disabled:cursor-default hover:bg-blue hover:text-[#fff] ${added ? "bg-[#2e7d32] text-white" : "bg-[#fff] text-[#111]"}`}
      >
        {added ? "✓" : "Add"}
      </button>
    </div>
  );
}
