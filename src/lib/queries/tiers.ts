// src/lib/queries/tiers.ts
// Looks up the 1/2/3-bottle variations for a product, the same tiers the
// rewards plugin's elx_bundle_tiers() builds from the pa_mg attribute.

import { gql } from "@/lib/graphql";
import { parsePrice } from "@/lib/formatPrice";
import { tierMetaFor } from "@/lib/bundle";
import type { CartTier } from "@/types/cart";

const CACHE_SECONDS = 3600;

export interface TierVariationNode {
  databaseId: number;
  price: string | null;
  stockStatus: string | null;
  attributes: { nodes: { value: string }[] };
}

export interface TierProductNode {
  databaseId: number;
  metaData: { key: string; value: string | null }[];
  variations?: { nodes: TierVariationNode[] };
}

// Shared by the FBT query so both read the same fields
export const TIER_PRODUCT_FIELDS = /* GraphQL */ `
  metaData(keysIn: ["_kg_base_price"]) {
    key
    value
  }
  ... on VariableProduct {
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
`;

const TIERS_QUERY = /* GraphQL */ `
  query GetProductTiers($ids: [Int]) {
    products(first: 50, where: { include: $ids }) {
      nodes {
        databaseId
        ${TIER_PRODUCT_FIELDS}
      }
    }
  }
`;

export function toCartTiers(node: TierProductNode): CartTier[] {
  // Compare-at price comes from _kg_base_price, like the product page
  const basePrice = parsePrice(
    node.metaData.find((m) => m.key === "_kg_base_price")?.value ?? ""
  );

  return (node.variations?.nodes ?? [])
    .filter((v) => v.stockStatus !== "OUT_OF_STOCK")
    .map((v, index) => {
      const raw = v.attributes.nodes.map((a) => a.value).join(" / ");
      const { label, qty } = tierMetaFor(raw, index);
      return {
        variationId: v.databaseId,
        label,
        price: parsePrice(v.price),
        regularPrice: basePrice * qty,
      };
    })
    .sort((a, b) => a.price - b.price);
}

export async function getProductTiers(
  productIds: number[]
): Promise<Record<number, CartTier[]>> {
  if (productIds.length === 0) return {};

  const data = await gql<{ products: { nodes: TierProductNode[] } }>(
    TIERS_QUERY,
    { ids: productIds },
    { revalidate: CACHE_SECONDS }
  );

  const map: Record<number, CartTier[]> = {};
  for (const node of data.products.nodes) {
    const tiers = toCartTiers(node);
    // Plugin rule: only products with 2+ real tiers get the bottle stepper
    if (tiers.length >= 2) map[node.databaseId] = tiers;
  }
  return map;
}
