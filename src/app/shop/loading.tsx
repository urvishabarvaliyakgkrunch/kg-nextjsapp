// src/app/shop/loading.tsx

import ShopSkeleton from "@/components/shop/ShopSkeleton";

// Shown while the shop page waits for the WooCommerce GraphQL answer
export default function Loading() {
  return <ShopSkeleton />;
}
