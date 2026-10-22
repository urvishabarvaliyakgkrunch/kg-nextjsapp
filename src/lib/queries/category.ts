// src/lib/queries/category.ts
// A category page needs NO new GraphQL call: it re-uses the shop catalog call
// (same query, same 1-hour cache) and keeps only the products of one category.

import { cache } from "react";
import { getShopPageData } from "@/lib/queries/shop";
import type { GQLProduct, GQLProductCategory } from "@/types";

export interface CategoryPageData {
  category: GQLProductCategory;
  products: GQLProduct[];
  // Size of the whole catalog, used in the hero sentence
  catalogCount: number;
}

// cache() lets generateMetadata and the page share one lookup in the same request
export const getCategoryPageData = cache(
  async (slug: string): Promise<CategoryPageData | null> => {
    const data = await getShopPageData();

    const category = data.productCategories.nodes.find((c) => c.slug === slug);
    if (!category) return null;

    const products = data.products.nodes.filter((p) =>
      p.productCategories?.nodes.some((c) => c.slug === slug)
    );

    return { category, products, catalogCount: data.products.nodes.length };
  }
);
