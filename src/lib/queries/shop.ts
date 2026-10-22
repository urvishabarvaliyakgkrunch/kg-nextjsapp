// src/lib/queries/shop.ts

import { cacheLife } from "next/cache";
import { gql } from "@/lib/graphql";
import { PRODUCT_CARD_FIELDS } from "./fragments";
import type { ShopPageData } from "@/types";

const SHOP_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FIELDS}

  query GetShopPageData {
    # MENU_ORDER = the drag-and-drop order set in wp-admin, same as the live shop
    products(first: 100, where: { status: "publish", orderby: [{ field: MENU_ORDER, order: ASC }] }) {
      nodes {
        ...ProductCardFields
      }
    }
    productCategories(first: 20, where: { hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        count
      }
    }
  }
`;

export async function getShopPageData(): Promise<ShopPageData> {
  "use cache";
  cacheLife("hours");
  return gql<ShopPageData>(SHOP_QUERY, {}, { revalidate: 3600 });
}

const PRODUCT_SLUGS_QUERY = /* GraphQL */ `
  query GetProductSlugs {
    products(first: 100, where: { status: "publish" }) {
      nodes { slug }
    }
  }
`;

// Existence check for proxy.ts (H2). The fetch cache does not help there (every product
// request still waited ~1.5s on WordPress), so the list is kept in this process's memory.
const SLUGS_TTL_MS = 10 * 60 * 1000;
// A slug missing from the list may be a brand-new product, so allow a refresh this often
const SLUGS_MISS_REFRESH_MS = 60 * 1000;

let slugCache: { slugs: Set<string>; loadedAt: number } | null = null;
let slugLoad: Promise<Set<string>> | null = null;

async function loadSlugs(): Promise<Set<string>> {
  // One shared request when several visitors arrive at once
  slugLoad ??= gql<{ products: { nodes: { slug: string }[] } }>(
    PRODUCT_SLUGS_QUERY,
    {},
    { revalidate: 3600 }
  )
    .then((data) => {
      const slugs = new Set(data.products.nodes.map((p) => p.slug));
      slugCache = { slugs, loadedAt: Date.now() };
      return slugs;
    })
    .finally(() => {
      slugLoad = null;
    });
  return slugLoad;
}

export async function isValidProductSlug(slug: string): Promise<boolean> {
  const age = slugCache ? Date.now() - slugCache.loadedAt : Infinity;

  if (slugCache && age < SLUGS_TTL_MS) {
    if (slugCache.slugs.has(slug)) return true;
    if (age < SLUGS_MISS_REFRESH_MS) return false;
  }

  return (await loadSlugs()).has(slug);
}
