// src/components/shop/CategoryCatalog.tsx
// The product area of a category page: small "BROWSE" label, big title, product grid.

import ProductGrid from "./ProductGrid";
import type { GQLProduct } from "@/types";

interface Props {
  categoryName: string;
  products: GQLProduct[];
}

export default function CategoryCatalog({ categoryName, products }: Props) {
  return (
    <div className="mx-auto px-[20px] py-[40px] md:p-[80px]">
      {/* Blue line + mono label, same eyebrow style as the rest of the site */}
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px w-8 bg-blue" aria-hidden="true" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[2.2px] text-blue">
          Browse
        </span>
      </div>

      <h2 className="mb-8 font-display text-[32px] font-bold leading-[40px] text-ink-dark md:text-[72px] md:leading-[73px] md:tracking-[-0.44px]">
        All current research {categoryName}.
      </h2>

      <ProductGrid products={products} />
    </div>
  );
}
