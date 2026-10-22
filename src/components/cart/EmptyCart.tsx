// src/components/cart/EmptyCart.tsx

import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center min-[768px]:rounded-chip min-[768px]:border min-[768px]:border-line min-[768px]:bg-white min-[768px]:px-6 min-[768px]:py-16">
      <p className="border-t-[3px] border-blue bg-white px-5 py-4 font-mono text-[14px] text-ink-dark min-[768px]:border-0 min-[768px]:bg-transparent min-[768px]:p-0">
        Your research cart is empty.
      </p>
      <Link
        href="/shop"
        className="mt-7 inline-block rounded-chip bg-blue px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 min-[768px]:mt-5"
      >
        Browse the catalog
      </Link>
    </div>
  );
}
