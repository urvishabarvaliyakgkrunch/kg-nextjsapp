// src/components/cart/CartSummarySkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Uneven widths read like real words instead of a stack of identical bars
const LABEL_WIDTHS = ["w-20", "w-24", "w-16"];

// Same box as CartSummary, so nothing jumps when the real totals arrive
export default function CartSummarySkeleton() {
  return (
    <aside
      aria-hidden="true"
      className="rounded-chip border border-cart-line bg-white px-7 pt-4 pb-4"
    >
      <Skeleton className="h-4 w-28 rounded-chip" />

      <div className="mt-7 flex flex-col gap-[26px]">
        {LABEL_WIDTHS.map((width) => (
          <div key={width} className="flex items-baseline justify-between gap-3">
            <Skeleton className={`h-3 rounded-chip ${width}`} />
            <Skeleton className="h-3 w-16 rounded-chip" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-9 h-12 w-full rounded-chip" />
    </aside>
  );
}
