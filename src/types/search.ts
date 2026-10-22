// src/types/search.ts

import type { MetaEntry } from "./product";

// One product row in the search dropdown (already trimmed to what the UI shows)
export interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  // Ready-to-show text like "$159.99" — formatted on the server
  price: string;
  image: string;
}

// One category row in the search dropdown
export interface SearchCategory {
  id: number;
  name: string;
  slug: string;
}

// What /api/search sends back to the browser
export interface SearchResponse {
  categories: SearchCategory[];
  products: SearchProduct[];
}

// Shape of the single catalog GraphQL call (used only inside lib/queries/search.ts)
export interface SearchCatalogNode {
  databaseId: number;
  name: string;
  slug: string;
  sku: string | null;
  price: string | null;
  image?: { sourceUrl: string } | null;
  productCategories?: { nodes: SearchCategory[] };
  // COA fields (dose, tags, PDF, lot number) so the COA search shares this same call
  metaData?: MetaEntry[] | null;
}
