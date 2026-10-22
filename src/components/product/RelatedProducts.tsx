// src/components/product/RelatedProducts.tsx
import SectionHeader from "./SectionHeader";
import ProductCard from "@/components/shop/ProductCard";
import type { RelatedProduct } from "@/types/product";
import type { GQLProduct } from "@/types";

interface Props {
  products: RelatedProduct[];
  productName: string;
}

// Same card as the shop grid — only the null fields differ between the two shapes
function toCardProduct(product: RelatedProduct): GQLProduct {
  return {
    ...product,
    price: product.price ?? undefined,
    image: product.image ?? undefined,
    variations: product.variations && {
      nodes: product.variations.nodes.map((v) => ({
        ...v,
        price: v.price ?? undefined,
        stockStatus: v.stockStatus ?? undefined,
      })),
    },
  };
}

export default function RelatedProducts({ products, productName }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-line bg-[url('/images/waves-water.webp')] md:bg-fixed">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-0">
        <SectionHeader
          eyebrow="Pairs With"
          title="Related compounds."
          description={`Other research peptides in the Elixser catalog cited alongside ${productName} in the published research literature.`}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.databaseId} product={toCardProduct(product)} index={i} variant="related" />
          ))}
        </div>
      </div>
    </section>
  );
}
