// src/lib/searchMatch.ts
// Pure matching rules for the header search. No fetching, no React.

import { formatPrice, parsePrice } from "@/lib/formatPrice";
import type {
  SearchCatalogNode,
  SearchCategory,
  SearchProduct,
  SearchResponse,
} from "@/types/search";

const MAX_PRODUCTS = 8;
const MAX_CATEGORIES = 4;

// Lower-case and split on spaces, so "glp 30" becomes ["glp", "30"]
function toWords(text: string): string[] {
  return text.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

// A product matches only when EVERY typed word is found in its name or SKU.
// Category names are left out on purpose: "pept" must not list every product in "Peptides".
function matchesAllWords(words: string[], node: SearchCatalogNode): boolean {
  const haystack = `${node.name} ${node.sku ?? ""}`.toLowerCase();
  return words.every((word) => haystack.includes(word));
}

// Names that START with the typed text float to the top, the rest keep catalog order
function rank(query: string, node: SearchCatalogNode): number {
  return node.name.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1;
}

function toProduct(node: SearchCatalogNode): SearchProduct {
  return {
    id: node.databaseId,
    name: node.name,
    slug: node.slug,
    sku: node.sku ?? "",
    price: formatPrice(parsePrice(node.price)),
    image: node.image?.sourceUrl ?? "",
  };
}

// Categories are collected from the products themselves, so we need no second GraphQL call
function collectCategories(nodes: SearchCatalogNode[]): SearchCategory[] {
  const byId = new Map<number, SearchCategory>();
  for (const node of nodes) {
    for (const category of node.productCategories?.nodes ?? []) {
      byId.set(category.id, category);
    }
  }
  return [...byId.values()];
}

export function searchCatalog(nodes: SearchCatalogNode[], query: string): SearchResponse {
  const words = toWords(query);
  if (words.length === 0) return { categories: [], products: [] };

  const categories = collectCategories(nodes)
    .filter((c) => words.every((word) => c.name.toLowerCase().includes(word)))
    .slice(0, MAX_CATEGORIES);

  const products = nodes
    .filter((node) => matchesAllWords(words, node))
    .sort((a, b) => rank(query, a) - rank(query, b))
    .slice(0, MAX_PRODUCTS)
    .map(toProduct);

  return { categories, products };
}
