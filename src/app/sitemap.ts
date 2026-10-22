// src/app/sitemap.ts
// Served at /sitemap.xml. Products and categories come from the same cached catalog
// call the shop page uses, so this adds no new load on WordPress.

import type { MetadataRoute } from "next";
import { getShopPageData } from "@/lib/queries/shop";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// /account, /cart and /checkout are left out on purpose — robots.ts disallows them too
const STATIC_PATHS = [
  "/",
  "/shop",
  "/coas",
  "/research",
  "/contact",
  "/faq",
  "/lab-partner",
  "/quality-standards",
  "/test-methods",
  "/privacy-policy",
  "/refund-policy",
  "/shipping-policy",
  "/terms-of-service",
];

// No lastModified anywhere: GraphQL does not give us a modified date for products, and a
// made-up one is worse than none — Google drops the signal when it cannot be trusted.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: path === "/" || path === "/shop" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.5,
  }));

  // A WordPress outage must not turn the sitemap into a 500 — Google would drop every
  // URL above along with the products. The static pages ship either way.
  try {
    const data = await getShopPageData();

    for (const product of data.products.nodes) {
      entries.push({
        url: `${SITE}/product/${product.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const category of data.productCategories.nodes) {
      entries.push({
        url: `${SITE}/product-category/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Catalog unreachable — serve the static pages rather than nothing
  }

  return entries;
}
