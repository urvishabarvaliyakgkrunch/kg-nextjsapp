// src/components/layout/CartButton.tsx
"use client";

import { useCart } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { formatPrice } from "@/lib/formatPrice";

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function CartButton() {
  const hasMounted = useHasMounted();
  const openDrawer = useCart((s) => s.openDrawer);
  const storedItems = useCart((s) => s.totalItems());
  const storedPrice = useCart((s) => s.totalPrice());

  const totalItems = hasMounted ? storedItems : 0;
  const totalPrice = hasMounted ? storedPrice : 0;
  const formattedPrice = formatPrice(totalPrice);

  return (
    <button
      onClick={openDrawer}
      className="relative flex cursor-pointer items-center gap-2 rounded-btn bg-[#0A0A0A] px-3 py-[12px] font-mono text-[13px] font-medium text-white transition-colors hover:bg-transparent hover:text-[#69727d] hover:opacity-90 md:px-[24px] md:text-[14px]"
      style={{
        border: "1px solid #69727d",
        borderRadius: "6px",
      }}
      aria-label={`Open cart — ${totalItems} items, ${formattedPrice}`}
    >
      {/* <CartIcon /> */}
      <span>{formattedPrice}</span>
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#d9534f] text-white text-[10px] font-bold leading-none">
          {totalItems}
        </span>
      )}
    </button>
  );
}
