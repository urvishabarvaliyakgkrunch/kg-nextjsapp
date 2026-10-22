// src/app/product/[slug]/loading.tsx

import ProductSkeleton from "@/components/product/ProductSkeleton";

// Shown the moment a product card is clicked, before WordPress answers
export default function Loading() {
  return <ProductSkeleton />;
}
