// src/app/product-category/[slug]/loading.tsx

import ShopSkeleton from "@/components/shop/ShopSkeleton";

// A category page has the same hero and card grid as the shop, so it shares that skeleton
export default function Loading() {
  return <ShopSkeleton />;
}
