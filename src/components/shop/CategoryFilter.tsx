// src/components/shop/CategoryFilter.tsx
"use client";

import type { GQLProductCategory } from "@/types";

interface Props {
  categories: GQLProductCategory[];
  onFilter: (slug: string | null) => void;
  activeSlug: string | null;
}

const ALL_SLUG = null;

export default function CategoryFilter({ categories, onFilter, activeSlug }: Props) {
  const tabs = [{ id: "all", name: "All Products", slug: ALL_SLUG }, ...categories];

  return (
    <div
      className="flex max-w-full flex-wrap items-center gap-5"
      role="tablist"
      aria-label="Product categories"
    >
      {tabs.map((tab) => {
        const isActive = tab.slug === activeSlug;
        return (
          <button
            key={tab.id ?? "all"}
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilter(tab.slug ?? null)}
            className={`shrink-0 cursor-pointer whitespace-nowrap rounded-[30px] px-[20px] py-[8px] text-[16px] font-normal leading-[normal] transition-colors hover:bg-blue hover:text-white md:text-[18px] ${
              isActive ? "bg-blue text-white" : "text-ink"
            }`}
          >
            {tab.name.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
