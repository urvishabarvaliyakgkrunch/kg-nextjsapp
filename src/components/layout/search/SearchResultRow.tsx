// src/components/layout/search/SearchResultRow.tsx
import Link from "next/link";
import Image from "next/image";
import HighlightedText from "@/components/layout/search/HighlightedText";
import type { SearchProduct } from "@/types/search";

interface Props {
  product: SearchProduct;
  // What the shopper typed — those letters are shown bold
  query: string;
  // Closes the search box once the shopper picks a product
  onNavigate: () => void;
}

export default function SearchResultRow({ product, query, onNavigate }: Props) {
  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onNavigate}
      className="flex items-center gap-[10px] px-5 py-[7px] transition-colors hover:bg-gray-light"
    >
      {/* Empty box when a product has no photo, so rows stay the same height */}
      <span className="relative size-14 shrink-0 overflow-hidden rounded-xs border border-gray-light bg-white">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="56px"
            className="object-contain"
          />
        )}
      </span>

      <span className="min-w-0 flex-1 text-[16px] font-normal leading-[22px] text-ink">
        <HighlightedText text={product.name} query={query} />
        {product.sku && (
          <span className="ml-2 text-[12px] font-normal text-ink">
            (SKU: <HighlightedText text={product.sku} query={query} />)
          </span>
        )}
      </span>

      {/* Sits lower than the name, like the original */}
      <span className="shrink-0 self-end pb-[14px] text-[14px] font-normal text-ink">
        {product.price}
      </span>
    </Link>
  );
}
