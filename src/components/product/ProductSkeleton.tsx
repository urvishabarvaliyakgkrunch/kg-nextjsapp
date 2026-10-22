// src/components/product/ProductSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Three bundle tiers — 1, 2 and 3 vials, same as every product
const PLACEHOLDER_TIERS = [0, 1, 2];

// Grey copy of the product hero while WordPress sends the compound data
export default function ProductSkeleton() {
  return (
    <section role="status" aria-label="Loading product" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-[30px] py-10 lg:grid-cols-2 lg:gap-x-[41px] lg:py-14">
        {/* Gallery — same tall frame as ProductGallery so nothing jumps */}
        <div className="flex min-h-[380px] items-center justify-center rounded-[16px] border border-line bg-white p-8 min-[481px]:min-h-[450px] min-[769px]:min-h-[700px] min-[1025px]:min-h-[900px]">
          <Skeleton className="h-[260px] w-full max-w-[460px] rounded-img min-[769px]:h-[480px] min-[1025px]:h-[620px]" />
        </div>

        <div>
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-5">
            <Skeleton className="h-3 w-16 rounded-chip" />
            <Skeleton className="h-3 w-28 rounded-chip" />
          </div>

          {/* Title */}
          <Skeleton className="mb-6 h-10 w-[85%] rounded-chip min-[1025px]:h-[75px]" />

          {/* Chips */}
          <div className="mb-5 flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24 rounded-pill" />
            <Skeleton className="h-7 w-32 rounded-pill" />
            <Skeleton className="h-7 w-28 rounded-pill" />
          </div>

          {/* Rating */}
          <Skeleton className="mb-7 h-4 w-48 rounded-chip" />

          {/* Buy box */}
          <div className="rounded-[12px] border border-line bg-white px-5 pb-[18px] pt-[22px]">
            <Skeleton className="mb-1 h-5 w-40 rounded-chip" />
            <Skeleton className="mb-4 h-3 w-[70%] rounded-chip" />

            <div className="grid grid-cols-1 gap-2 min-[481px]:grid-cols-2 md:grid-cols-3">
              {PLACEHOLDER_TIERS.map((tier) => (
                <Skeleton key={tier} className="h-[120px] w-full rounded-card" />
              ))}
            </div>
          </div>

          <Skeleton className="mt-5 h-[54px] w-full rounded-[3px]" />
          <Skeleton className="mt-3 h-[72px] w-full rounded-[3px]" />
        </div>
      </div>
    </section>
  );
}
