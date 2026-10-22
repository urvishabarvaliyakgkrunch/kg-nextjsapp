// src/components/cart/FbtSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// The live block suggests three products, so hold space for three
const PLACEHOLDER_ROWS = [0, 1, 2];

// Plain grey rows the same 72px height as FbtItem — the list keeps its height
// when the real dark cards land
export default function FbtSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading suggestions"
      className="flex flex-col gap-2.5"
    >
      {PLACEHOLDER_ROWS.map((row) => (
        <Skeleton key={row} className="h-[72px] w-full rounded-r-[10px]" />
      ))}
    </div>
  );
}
