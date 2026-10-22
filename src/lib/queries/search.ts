// src/lib/queries/search.ts
// ONE GraphQL call loads the whole catalog; every search after that is a plain
// in-memory filter, so typing never hits WordPress.

import { gql } from "@/lib/graphql";
import { COA_LOT_META_KEY, COA_PRODUCT_META_KEYS } from "@/lib/coasMapper";
import { searchCoas } from "@/lib/coaSearchMatch";
import { searchCatalog } from "@/lib/searchMatch";
import type { SampleCoaItem } from "@/types/coas";
import type { SearchCatalogNode, SearchResponse } from "@/types/search";

// Same hour as the shop page, so one /api/revalidate call refreshes both
const CATALOG_SECONDS = 3600;

const SEARCH_CATALOG_QUERY = /* GraphQL */ `
  query GetSearchCatalog {
    products(first: 100, where: { status: "publish" }) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl(size: THUMBNAIL)
        }
        productCategories {
          nodes {
            id: databaseId
            name
            slug
          }
        }
        ... on Product {
          metaData(keysIn: ${JSON.stringify([...COA_PRODUCT_META_KEYS, COA_LOT_META_KEY])}) {
            key
            value
          }
        }
        ... on SimpleProduct {
          sku
          price
        }
        ... on VariableProduct {
          sku
          price
        }
      }
    }
  }
`;

// Header search and COA search both read this one cached call
async function fetchCatalog(): Promise<SearchCatalogNode[]> {
  const data = await gql<{ products: { nodes: SearchCatalogNode[] } }>(
    SEARCH_CATALOG_QUERY,
    {},
    { revalidate: CATALOG_SECONDS }
  );
  return data.products.nodes;
}

export async function getSearchResults(query: string): Promise<SearchResponse> {
  return searchCatalog(await fetchCatalog(), query);
}

export async function getCoaSearchResults(query: string): Promise<SampleCoaItem[]> {
  return searchCoas(await fetchCatalog(), query);
}
