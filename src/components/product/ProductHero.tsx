// src/components/product/ProductHero.tsx

import Link from "next/link";
import ProductGallery from "./ProductGallery";
import ProductChips from "./ProductChips";
import ProductRating from "./ProductRating";
import BuyBox from "./BuyBox";
import type { BundleTier, ProductDetail, ProductMeta, WPImage } from "@/types/product";
import type { QtyRule } from "@/types/cart";

interface Props {
  product: ProductDetail;
  meta: ProductMeta;
  tiers: BundleTier[];
  // Set for simple products only — see lib/qtyTiers.ts
  qtyRules?: QtyRule[];
  basePrice: number;
  maxQty?: number;
  images: WPImage[];
  // Keyed by variation id — BuyBox shows the line for whichever tier is selected
  pointsMessages: Record<number, string>;
  // Average stars and the text beside them, already worked out from WiserReview data
  rating: { score: number; caption: string };
}

export default function ProductHero({
  product,
  meta,
  tiers,
  qtyRules,
  basePrice,
  maxQty,
  images,
  pointsMessages,
  rating,
}: Props) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-[20px] pb-6 pt-3 md:px-8 lg:px-10 min-[768px]:pt-10 min-[768px]:pb-6 lg:grid-cols-2 lg:gap-x-[30px] lg:pt-14 lg:pb-8">
        <ProductGallery images={images} productName={product.name} />

        <div className="px-5 md:px-0">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 hidden items-center gap-5 font-mono md:flex text-[11px] font-medium leading-[18px] text-black"
          >
            <Link href="/shop" className="transition-colors hover:text-blue">
              Catalog
            </Link>
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </nav>

          {/* Live: Space Grotesk 72/75 → 42/50 → 32/40, no letter-spacing */}
          <h1 className="mb-3 font-display md:mb-6 text-[32px] font-bold leading-[40px] text-ink-dark min-[769px]:text-[42px] min-[769px]:leading-[50px] min-[1025px]:text-[72px] min-[1025px]:leading-[75px]">
            {product.name}
          </h1>

          {/* Live order: rating, then size · purity · type chips */}
          <div className="mb-3 md:mb-[20px]">
            <ProductRating score={rating.score} caption={rating.caption} />
          </div>
          <ProductChips
            items={[meta.mgPerVial, meta.purityClass, meta.blendType]}
            highlight={meta.purityClass}
          />

          <BuyBox
            tiers={tiers}
            qtyRules={qtyRules}
            basePrice={basePrice}
            maxQty={maxQty}
            productId={product.databaseId}
            productName={product.name}
            image={product.image?.sourceUrl ?? ""}
            slug={product.slug}
            coaUrl={meta.coaUrl}
            pointsMessages={pointsMessages}
            hasCoaSection={meta.coaRows.length > 0}
          />
        </div>
      </div>
    </section>
  );
}
