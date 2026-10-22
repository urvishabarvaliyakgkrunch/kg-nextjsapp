// src/components/shop/ShopSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Eight cards fill two rows on desktop — enough to look like the real catalog
const PLACEHOLDER_CARDS = [0, 1, 2, 3, 4, 5, 6, 7];

// Category tabs have different word lengths, so the chips are not all one width
const FILTER_WIDTHS = ["w-[120px]", "w-[80px]", "w-[96px]", "w-[88px]"];

// Shop page uses the same wider container as the real page
const shopContainer = {
  maxWidth: "1600px",
  paddingLeft: "clamp(16px, 3vw, 40px)",
  paddingRight: "clamp(16px, 3vw, 40px)",
};

export default function ShopSkeleton() {
  return (
    <div role="status" aria-label="Loading the catalog" className="min-h-screen">
      {/* Hero text */}
      <section className="border-b border-gray-light">
        <div className="mx-auto py-12" style={shopContainer}>
          <Skeleton className="mb-6 h-3 w-[220px] rounded-chip" />
          <Skeleton className="mb-4 h-10 w-[320px] max-w-full rounded-chip" />
          <Skeleton className="h-4 w-full max-w-md rounded-chip" />
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="mx-auto py-10" style={shopContainer}>
          <Skeleton className="mb-8 h-7 w-[360px] max-w-full rounded-chip" />

          {/* Filter chips + search box */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_WIDTHS.map((width) => (
                <Skeleton key={width} className={`h-9 rounded-chip ${width}`} />
              ))}
            </div>
            <div className="flex-shrink-0 sm:ml-auto">
              <Skeleton className="h-9 w-full rounded-btn sm:w-56" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[30px] md:grid-cols-3 lg:grid-cols-4">
            {PLACEHOLDER_CARDS.map((card) => (
              <ProductCardSkeleton key={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
