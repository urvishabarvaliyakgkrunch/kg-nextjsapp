// src/lib/queries/fbt.ts
// Port of the WordPress fbt_get_suggested_ids() / fbt_render_html() snippet.
// Each product stores its partners in the "fbt_product_ids" meta field.
//
// The whole catalog is fetched once and cached, so working out suggestions for
// any cart is pure lookup — no WordPress call per cart.

import { gql } from "@/lib/graphql";
import { parsePrice } from "@/lib/formatPrice";
import { tierMetaFor } from "@/lib/bundle";
import type { FbtSuggestion, FbtVariation } from "@/types/cart";

const MAX_SUGGESTIONS = 4;
const CATALOG_SECONDS = 3600;

interface CatalogNode {
  databaseId: number;
  name: string;
  slug: string;
  price: string | null;
  stockStatus: string | null;
  regularPrice?: string | null;
  stockQuantity?: number | null;
  backorders?: string | null;
  elxQtyTiers?: string | null;
  image?: { sourceUrl: string; altText: string } | null;
  metaData: { key: string; value: string | null }[];
  variations?: {
    nodes: {
      databaseId: number;
      price: string | null;
      stockStatus: string | null;
      attributes: { nodes: { value: string }[] };
    }[];
  };
}

const CATALOG_QUERY = /* GraphQL */ `
  query GetFbtCatalog {
    products(first: 100, where: { status: "publish" }) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl(size: THUMBNAIL)
          altText
        }
        metaData(keysIn: ["fbt_product_ids", "_kg_base_price"]) {
          key
          value
        }
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
          stockQuantity
          backorders
          elxQtyTiers
        }
        ... on VariableProduct {
          price
          stockStatus
          variations(first: 10) {
            nodes {
              databaseId
              price
              stockStatus
              attributes {
                nodes {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Woo's own related products — only needed when fbt_product_ids points nowhere.
// Kept out of the catalog query because it roughly doubles its cost.
const RELATED_QUERY = /* GraphQL */ `
  query GetFbtRelated {
    products(first: 100, where: { status: "publish" }) {
      nodes {
        databaseId
        ... on VariableProduct {
          related(first: 4) {
            nodes {
              databaseId
            }
          }
        }
      }
    }
  }
`;

async function getCatalog(): Promise<Map<number, CatalogNode>> {
  const data = await gql<{ products: { nodes: CatalogNode[] } }>(
    CATALOG_QUERY,
    {},
    { revalidate: CATALOG_SECONDS }
  );
  return new Map(data.products.nodes.map((n) => [n.databaseId, n]));
}

async function getRelatedMap(): Promise<Map<number, number[]>> {
  const data = await gql<{
    products: { nodes: { databaseId: number; related?: { nodes: { databaseId: number }[] } }[] };
  }>(RELATED_QUERY, {}, { revalidate: CATALOG_SECONDS });

  return new Map(
    data.products.nodes.map((n) => [
      n.databaseId,
      (n.related?.nodes ?? []).map((r) => r.databaseId),
    ])
  );
}

// Meta holds a comma list like "4088, 4258, 4104"
function parseIdList(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => parseInt(part.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function toSuggestion(node: CatalogNode): FbtSuggestion {
  // Compare-at price comes from _kg_base_price, the same meta the product page uses
  const basePrice = parsePrice(
    node.metaData.find((m) => m.key === "_kg_base_price")?.value ?? ""
  );

  const variations: FbtVariation[] = (node.variations?.nodes ?? [])
    .filter((v) => v.stockStatus !== "OUT_OF_STOCK")
    .map((v, index) => {
      const raw = v.attributes.nodes.map((a) => a.value).join(" / ");
      const { label, qty } = tierMetaFor(raw, index);
      return {
        variationId: v.databaseId,
        label: raw || "Default",
        tierLabel: label,
        price: parsePrice(v.price),
        regularPrice: basePrice * qty,
      };
    })
    .sort((a, b) => a.price - b.price);

  return {
    productId: node.databaseId,
    name: node.name,
    slug: node.slug,
    image: node.image?.sourceUrl ?? "",
    price: parsePrice(node.price),
    variations,
    ...(variations.length === 0
      ? {
          regularPrice: Math.max(basePrice, parsePrice(node.regularPrice)),
          qtyTiers: node.elxQtyTiers,
          stockQuantity: node.stockQuantity,
          backorders: node.backorders,
        }
      : {}),
  };
}

export async function getFbtSuggestions(
  cartProductIds: number[]
): Promise<FbtSuggestion[]> {
  // Loaded even for an empty cart so the drawer can warm this cache on page load
  const catalog = await getCatalog();
  if (cartProductIds.length === 0) return [];

  const inCart = new Set(cartProductIds);
  const seen = new Set<number>();
  const pick = (ids: number[]) => {
    for (const id of ids) {
      if (inCart.has(id) || seen.has(id)) continue;
      const node = catalog.get(id);
      if (!node || node.stockStatus === "OUT_OF_STOCK") continue;
      seen.add(id);
    }
  };

  // Walk products in cart order, same as the PHP loop, so the list stays predictable
  for (const id of cartProductIds) {
    pick(parseIdList(
      catalog.get(id)?.metaData.find((m) => m.key === "fbt_product_ids")?.value ?? null
    ));
  }

  // Safety net for products whose meta is empty or points at stale IDs
  if (seen.size === 0) {
    const related = await getRelatedMap();
    for (const id of cartProductIds) pick(related.get(id) ?? []);
  }

  return [...seen]
    .slice(0, MAX_SUGGESTIONS)
    .map((id) => catalog.get(id))
    .filter((n): n is CatalogNode => Boolean(n))
    .map(toSuggestion);
}
