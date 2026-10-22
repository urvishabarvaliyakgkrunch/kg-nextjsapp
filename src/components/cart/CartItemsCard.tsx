// src/components/cart/CartItemsCard.tsx
"use client";

import CartPageItem from "./CartPageItem";
import type { CartItem } from "@/types/cart";

interface Props {
  items: CartItem[];
  onUpdate: () => void;
  isUpdating: boolean;
}

const HEAD = "pr-5 font-mono text-[14px] font-bold leading-[21px] text-black";

export default function CartItemsCard({ items, onUpdate, isUpdating }: Props) {
  return (
    <div className="border border-cart-line bg-white px-[30px] pt-[16px] pb-[16px]">
      {/* Headings sit over the same columns as a row — desktop only */}
      <div className="hidden grid-cols-[20px_73px_minmax(0,1fr)_79px_142px_88px] pb-2 xl:grid">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span className={HEAD}>Product</span>
        <span className={HEAD}>Price</span>
        <span className={HEAD}>Quantity</span>
        <span className={HEAD}>Subtotal</span>
      </div>

      <div className="divide-y divide-row-line">
        {items.map((item) => (
          <CartPageItem key={item.variationId} item={item} />
        ))}
      </div>

      {/* Re-prices the cart against WooCommerce — stock or promos may have moved.
          Faded like the live site, where Woo disables it until a line changes. */}
      <div className="border-t border-row-line pt-4">
        <button
          type="button"
          onClick={onUpdate}
          disabled={isUpdating}
          className="border-2 border-blue-soft p-[14px] font-mono text-[14px] font-bold leading-[14px] text-blue-soft transition-colors hover:border-blue hover:bg-blue hover:text-white disabled:opacity-60 transition-all disabled:hover:border-blue-soft disabled:hover:text-blue-soft"
        >
          {isUpdating ? "Updating…" : "Update Cart"}
        </button>
      </div>
    </div>
  );
}
