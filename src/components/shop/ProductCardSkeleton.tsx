// src/components/shop/ProductCardSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Same box as ProductCard, so the grid keeps its height when products land
export default function ProductCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-gray-light bg-white">
      {/* Image area */}
      <div className="flex min-h-[220px] items-center justify-center bg-white p-6">
        <Skeleton className="h-[180px] w-[140px] rounded-img" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-5 w-[75%] rounded-chip" />

        {/* Price on the left, the two buttons on the right */}
        <div className="mt-auto flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-chip" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-btn" />
            <Skeleton className="h-10 w-[76px] rounded-btn" />
          </div>
        </div>
      </div>
    </article>
  );
}
