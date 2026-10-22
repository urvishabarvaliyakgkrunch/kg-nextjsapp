// src/components/home/Featured.tsx

import ProductCard from "@/components/shop/ProductCard";
import type { FeaturedSectionData } from "@/types/home";

export default function Featured({ data }: { data: FeaturedSectionData }) {
  if (data.products.length === 0) return null;

  return (
    <section aria-label="Featured" className="bg-white py-[30px] lg:py-[60px]">
      {/* Live: widget inset 10px (not container-site 16px) */}
      <div className="mx-auto w-full max-w-[1300px] px-5 min-[768px]:px-4 lg:px-[10px]">
        {data.smallHeading && (
          <p className="mb-2 font-mono text-[11px] font-medium leading-[18px] tracking-[2.2px] text-blue uppercase">
            {data.smallHeading}
          </p>
        )}
        {data.mainHeading && (
          <h2 className="mb-8 font-display text-[32px] font-bold leading-[1.2] tracking-[-1.2px] text-ink-dark md:mb-10 md:text-[45px] lg:text-[56px] lg:leading-[58px] lg:tracking-[-1.68px]">
            {data.mainHeading}
          </h2>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-0">
          {data.products.map((product, i) => (
            <ProductCard key={product.databaseId} index={i} product={product} variant="home" />
          ))}
        </div>
        {data.bottomNote && (
          <div className="mt-[30px] text-center font-mono text-[14px] font-medium uppercase leading-[18px] text-[#7A7A7A] min-[768px]:mt-[10px]">
            {data.bottomNote}
          </div>
        )}
      </div>
    </section>
  );
}
