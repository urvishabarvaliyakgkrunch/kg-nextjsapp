// src/app/product/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries/product";
import { parseProductMeta } from "@/lib/productMeta";
import { buildBundleTiers } from "@/lib/bundle";
import { buildQtyTiers, parseQtyRules } from "@/lib/qtyTiers";
import { parsePrice } from "@/lib/formatPrice";
import { getProductPointsMessages } from "@/lib/loyalty";
import { getProductReviews } from "@/lib/reviews";
import { heroRating } from "@/lib/reviewFormat";
import { buildReviewSchema } from "@/lib/reviewSchema";
import ProductHero from "@/components/product/ProductHero";
import CompoundProfile from "@/components/product/CompoundProfile";
import ReferencesSection from "@/components/product/ReferencesSection";
import CoaSection from "@/components/product/CoaSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import FaqSection from "@/components/product/FaqSection";
import TrustProofBanner from "@/components/product/TrustProofBanner";
import ReviewsSection from "@/components/product/ReviewsSection";
import ReviewJsonLd from "@/components/product/ReviewJsonLd";
import ResearchIntegrityCta from "@/components/product/ResearchIntegrityCta";
import AttentiveProduct from "@/components/tracking/AttentiveProduct";
import { absoluteUrl } from "@/lib/media";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const meta = parseProductMeta(product.metaData);
  return {
    title: product.name,
    description:
      meta.compoundProfileDescription || meta.literature[0] || product.name,
    alternates: { canonical: `/product/${slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const meta = parseProductMeta(product.metaData);
  // A simple product prices by quantity (rules from WordPress); a variable one by its variations
  const isSimple = (product.variations?.nodes ?? []).length === 0;
  const activePrice = parsePrice(product.price);
  // The struck-through "was" price: the store keeps it in _kg_base_price (as on variable products),
  // falling back to Woo's regular price when that is not set
  const regularPrice = Math.max(
    meta.basePrice,
    parsePrice(product.regularPrice),
    activePrice
  );
  const qtyRules = isSimple ? parseQtyRules(product.elxQtyTiers) : [];
  // Woo refuses more than the stock left, so offer (and let the cart hold) no more than that
  const maxQty =
    isSimple && product.backorders === "NO" && typeof product.stockQuantity === "number"
      ? product.stockQuantity
      : undefined;
  const allTiers = isSimple
    ? activePrice > 0
      ? buildQtyTiers(
          product.databaseId,
          regularPrice,
          activePrice,
          qtyRules,
          product.stockStatus !== "OUT_OF_STOCK"
        )
      : []
    : buildBundleTiers(product.variations?.nodes ?? [], meta.basePrice);
  const tiers = maxQty === undefined ? allTiers : allTiers.filter((t) => t.qty <= maxQty);
  if (tiers.length === 0) notFound();

  const images = [
    ...(product.image ? [product.image] : []),
    ...(product.galleryImages?.nodes ?? []),
  ];

  // Points and reviews do not depend on each other, so they load side by side
  const [pointsMessages, reviews] = await Promise.all([
    // One request for all three tiers. WordPress works the points out, we never guess them.
    getProductPointsMessages(tiers.map((tier) => tier.variationId)),
    getProductReviews(product.databaseId),
  ]);

  return (
    <>
      {/* Cheapest tier is the one shown first, so it stands for the product */}
      <AttentiveProduct
        productId={product.databaseId}
        name={product.name}
        type={product.type}
        price={tiers[0].total}
        image={absoluteUrl(product.image?.sourceUrl)}
        variationId={tiers[0].variationId}
      />
      <ProductHero
        product={product}
        meta={meta}
        tiers={tiers}
        qtyRules={isSimple ? qtyRules : undefined}
        basePrice={activePrice}
        maxQty={maxQty}
        images={images}
        pointsMessages={pointsMessages}
        rating={heroRating(reviews)}
      />
      <CompoundProfile meta={meta} />
      <ReferencesSection references={meta.references} productName={product.name} />
      <TrustProofBanner />
      <CoaSection meta={meta} />
      <RelatedProducts
        products={product.related?.nodes ?? []}
        productName={product.name}
      />
      <ReviewsSection reviews={reviews} />
      <ReviewJsonLd
        schema={buildReviewSchema({
          name: product.name,
          // Structured data needs a full address, and the image path is now relative to our site
          image: absoluteUrl(product.image?.sourceUrl),
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
          reviews,
        })}
      />
      <FaqSection faqs={meta.faqs} />
      <ResearchIntegrityCta />
    </>
  );
}
