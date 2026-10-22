// src/app/product-category/[slug]/page.tsx
// Same URL shape as the live WordPress site: /product-category/glps

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryPageData } from "@/lib/queries/category";
import PageHero from "@/components/common/PageHero";
import CategoryCatalog from "@/components/shop/CategoryCatalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);
  if (!data) return {};

  return {
    title: `${data.category.name} — Research Peptides`,
    description: `Third-party tested ${data.category.name} for research use. Signed COA on every vial. Made in the USA.`,
    alternates: { canonical: `/product-category/${slug}` },
  };
}

export default async function ProductCategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);
  if (!data) notFound();

  return (
    <div className="min-h-screen">
      <section className="hidden bg-white px-[60px] py-[50px] md:block">
        <PageHero
          eyebrow="Research-Grade Peptides"
          title="Product Catalog"
          description={`Browse our full selection of ${data.catalogCount} premium research peptides — all ≥99% purity, HPLC & MS verified.`}
          isShopPage={true}
        />
      </section>

      <section>
        <CategoryCatalog categoryName={data.category.name} products={data.products} />
      </section>
    </div>
  );
}
