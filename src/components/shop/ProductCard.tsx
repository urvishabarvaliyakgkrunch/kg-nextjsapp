// src/components/shop/ProductCard.tsx

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import LinkPending from "@/components/ui/LinkPending";
import { formatPrice, parsePrice } from "@/lib/formatPrice";
import { tierMetaFor } from "@/lib/bundle";
import type { GQLProduct } from "@/types";

interface Props {
  product: GQLProduct;
  index: number;
  variant?: "catalog" | "home" | "related" | "shop";
  // Set for above-the-fold cards so the browser fetches the image immediately
  priority?: boolean;
}

// Strips HTML tags from WooCommerce price strings like "<del>$319.98</del>"
function cleanPrice(raw?: string): string {
  if (!raw) return "";
  return raw.replace(/<[^>]+>/g, "").trim();
}

// WordPress runs the "Price Min Set" snippet, which replaces a variable
// product's price range with the cheapest variation alone. Woo still sends the
// range ("$75.00 - $216.75"), so collapse it to the low end here. parsePrice
// already reads the first half of a range, which Woo orders cheapest-first.
function lowestPrice(raw?: string): string {
  if (!cleanPrice(raw)) return "";
  return formatPrice(parsePrice(raw));
}

// Compare-at price comes from _kg_base_price × the cheapest tier's bottle count,
// the same strike price the product page shows for that tier
function compareAtPrice(product: GQLProduct): number {
  const basePrice = parsePrice(
    product.metaData?.find((m) => m.key === "_kg_base_price")?.value ?? ""
  );
  const cheapest = [...(product.variations?.nodes ?? [])].sort(
    (a, b) => parsePrice(a.price) - parsePrice(b.price)
  )[0];
  const vialSlug =
    cheapest?.attributes?.nodes.find((a) => a.name === "pa_mg")?.value ?? "";
  return basePrice * tierMetaFor(vialSlug).qty;
}

export default function ProductCard({ product, index, variant = "catalog", priority }: Props) {
  const { slug, name, image, price, regularPrice, salePrice } = product;

  const displayPrice = lowestPrice(price);
  const compareAt = compareAtPrice(product);
  const isOnSale = salePrice && salePrice !== "" && salePrice !== "0";
  // Fall back to Woo's own sale pricing for products without a base price
  const displayRegular =
    compareAt > parsePrice(price)
      ? formatPrice(compareAt)
      : isOnSale
        ? lowestPrice(regularPrice)
        : "";
  const compact = variant !== "catalog";
  const home = variant === "home";

  return (
    <article className={`${compact ? "" : "mx-auto w-full max-w-[330px] md:max-w-none"} rounded-[12px] border-3 border-[#ffffff00] transition-all duration-300 hover:border-1 hover:border-[#000000]`}>
      <div className={`flex h-full flex-col overflow-hidden rounded-[12px] border border-[#E5E5E2] bg-white lg:gap-[20px] lg:p-[10px] ${compact ? "gap-2 p-2 md:gap-3" : "gap-3 p-[9px] md:p-2"}`}>
        {/* Image */}
        <div className={`relative flex items-center justify-center overflow-hidden bg-white lg:aspect-auto lg:min-h-[270px] ${compact ? "h-[215px] md:aspect-square md:h-auto" : "h-[310px] md:aspect-square md:h-auto"}`}>
          <span
            className="absolute top-3 right-3 flex items-center justify-center text-[14px] font-normal px-[8px] py-[2px] leading-[1.6em] text-[#333] border border-blue bg-white z-1 "
            aria-hidden="true"
          >
            {index + 1}
          </span>

          <Link href={`/product/${slug}`} className="flex h-full w-full items-center justify-center">
            {image?.sourceUrl ? (
              <Image
                src={image.sourceUrl}
                alt={image.altText || name}
                width={180}
                height={270}
                sizes={compact ? "(max-width: 767px) 46vw, (max-width: 1024px) 33vw, 25vw" : "(max-width: 767px) 310px, (max-width: 1024px) 33vw, 25vw"}
                priority={priority}
                className={`max-h-full max-w-full w-auto scale-[1.4] rounded-img object-contain md:h-[85%] lg:h-[270px] ${compact ? "h-[145px]" : "h-[270px]"}`}
              />
            ) : (
              <div className="w-[140px] h-[180px] bg-gray-light rounded-img" aria-hidden="true" />
            )}
          </Link>
        </div>

        {/* Info */}
        <div className={`flex flex-1 flex-col ${compact ? "gap-2 md:gap-3" : "gap-3"}`}>
          <div className="border-b border-[#E5E5E5] pb-[8px]">
            <h3 className={`my-1 h-auto font-display text-[14px] font-bold leading-[16px] tracking-[-0.44px] text-ink-dark md:my-[8px] md:leading-[23.5px] ${compact ? `min-h-[32px] md:min-h-0 ${home ? "md:text-[14px]" : "md:h-[45px] md:text-[20px]"}` : "md:h-[45px] md:text-[20px]"}`}>
              {name}
            </h3>
            {product.metaData?.map((meta) => (
              meta.key === 'mg_per_vial' && (
                <p key={meta.key} className={`font-mono font-bold text-[#5A5A57] ${compact ? "min-h-[22px] text-[9px] leading-[11px] tracking-[1px] md:min-h-0 md:tracking-[1.32px]" : "text-[11px] leading-[14px] tracking-[1.32px] md:text-[9px] md:leading-[11px]"}`}>
                  {meta.value}
                </p>
              )
            ))}
          </div>

          {/* Price row + buttons */}
          <div className="mt-auto flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2">
            <div className="flex items-baseline gap-1.5 md:gap-2">
              <span className="font-display text-[16px] font-bold text-ink-dark">
                {displayPrice}
              </span>
              {displayRegular && (
                <span className="text-sm text-muted line-through">
                  {displayRegular}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 md:ml-auto md:justify-start">
              <AddToCartButton product={product} compactMobile={compact} />
              <Link
                href={`/product/${slug}`}
                className={`flex items-center gap-1 rounded-btn bg-[#0A0A0A] font-semibold text-white transition-opacity hover:bg-blue lg:px-4 lg:text-[13px] ${compact ? "px-2 py-2 text-[10px] md:px-3 md:py-2.5 md:text-[12px]" : "px-4 py-2.5 text-[12px]"}`}
                style={{ boxShadow: "0px 4px 14px 0px rgba(0, 102, 255, 0.22)" }}
              >
                VIEW →
              </Link>

            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
