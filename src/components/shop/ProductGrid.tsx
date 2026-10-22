// src/components/shop/ProductGrid.tsx

import ProductCard from "./ProductCard";
import type { GQLProduct } from "@/types";

interface Props {
  products: GQLProduct[];
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted py-16">
        No products found in this category.
      </p>
    );
  }

  // Phone: two per row, same compact card as the home page
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-[30px] lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} priority={i < 4} variant="shop" />
      ))}
    </div>
  );
}
