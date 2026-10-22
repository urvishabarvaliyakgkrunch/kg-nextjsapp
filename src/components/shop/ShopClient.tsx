// src/components/shop/ShopClient.tsx
"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";
import type { GQLProduct, GQLProductCategory } from "@/types";

interface Props {
  products: GQLProduct[];
  categories: GQLProductCategory[];
}

export default function ShopClient({ products, categories }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const visibleCategories = categories.filter(
    (c) => c.slug !== "uncategorized" && (c.count ?? 0) > 0
  );

  const filtered = products.filter((p) => {
    const matchCat = activeSlug
      ? p.productCategories?.nodes.some((c) => c.slug === activeSlug)
      : true;
    const matchSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Filter + search bar */}
      <div className="mb-8 flex flex-col gap-3 min-[768px]:flex-row min-[768px]:items-center">
        <CategoryFilter
          categories={visibleCategories}
          activeSlug={activeSlug}
          onFilter={(slug) => { setActiveSlug(slug); setSearch(""); }}
        />

        {/* Search input — matches reference site */}
        <div className="w-full max-w-[260px] flex-shrink-0 min-[768px]:ml-auto min-[768px]:w-auto min-[768px]:max-w-none">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Products..."
            className="w-full  pl-[18px] pr-[28px] py-[16px] text-[16px] leading-[1.5] text-[#515962] border border-[#cdcdcd] rounded-[20px] bg-white placeholder:text-[#515962] focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <ProductGrid products={filtered} />
    </div>
  );
}
