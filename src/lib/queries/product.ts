// src/lib/queries/product.ts

import { cacheLife } from "next/cache";
import { gql } from "@/lib/graphql";
import type { ProductDetail } from "@/types/product";

const COMPONENT_FIELDS = [
  "class",
  "sequence",
  "cas_number",
  "molecular_formula",
  "molecular_weight",
  "per-component_purity",
];

// ACF generated component 2 with trailing dashes — the keys are not symmetrical
const COMPONENT_KEYS = [
  "component_01_tittle",
  ...COMPONENT_FIELDS.map((f) => `component_01_${f}`),
  "component_2_title-",
  "component_2_class-2",
  ...COMPONENT_FIELDS.filter((f) => f !== "class").map((f) => `component_2_${f}-`),
];

const REPEATER_KEYS = [
  ...Array.from({ length: 12 }, (_, i) => [
    `faq_${i}_quetion_`,
    `faq_${i}_answer`,
  ]).flat(),
  ...Array.from({ length: 8 }, (_, i) =>
    ["authors", "journal", "title", "pubmed_id", "pubmed_url"].map(
      (f) => `product_references_${i}_ref_${f}`
    )
  ).flat(),
];

const PRODUCT_META_KEYS = [
  "_kg_base_price",
  "lot_number",
  "mg_per_vial",
  "blend_type",
  "class",
  "type_title_",
  "compound_profile_title",
  "compound_profile_description_",
  "literature_title",
  "the_literature",
  "documented_research_areas",
  "coas",
  "test",
  "faq",
  "product_references",
  "-blend_total_content",
  "-blend_form",
  "-blend_identity_lc-ms",
  "-blend_sterility__lal",
  "-blend_storage",
  "-blend_origin",
  ...COMPONENT_KEYS,
  ...REPEATER_KEYS,
];

const RELATED_META_KEYS = [
  "_kg_base_price",
  "mg_per_vial",
  "component_01_cas_number",
  "component_01_molecular_formula",
  "component_01_molecular_weight",
];

const PRODUCT_QUERY = /* GraphQL */ `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      type
      image { sourceUrl altText }
      galleryImages { nodes { sourceUrl altText } }
      productCategories { nodes { name slug } }
      metaData(keysIn: ${JSON.stringify(PRODUCT_META_KEYS)}) { key value }
      ... on SimpleProduct { price regularPrice stockStatus stockQuantity backorders elxQtyTiers }
      ... on VariableProduct {
        price
        variations(first: 20) {
          nodes {
            databaseId
            name
            price
            regularPrice
            stockStatus
            attributes { nodes { name value } }
          }
        }
        related(first: 4) {
          nodes {
            id
            databaseId
            name
            slug
            image { sourceUrl(size: MEDIUM) altText }
            metaData(keysIn: ${JSON.stringify(RELATED_META_KEYS)}) { key value }
            ... on SimpleProduct { price }
            ... on VariableProduct {
              price
              variations(first: 20) {
                nodes {
                  databaseId
                  price
                  stockStatus
                  attributes { nodes { name value } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  "use cache";
  cacheLife("hours");
  try {
    const data = await gql<{ product: ProductDetail | null }>(
      PRODUCT_QUERY,
      { slug },
      { revalidate: 3600 }
    );
    return data.product;
  } catch (error) {
    // WPGraphQL errors on an unknown slug instead of returning null — that is a 404, not a failure
    const message = error instanceof Error ? error.message : "";
    if (/No product ID was found/i.test(message)) return null;
    throw error;
  }
}
