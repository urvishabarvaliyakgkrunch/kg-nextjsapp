// src/lib/coaSearchMatch.ts
// Pure matching rules for the COA search boxes. No fetching, no React.

import { COA_LOT_META_KEY, toSampleCoa } from "@/lib/coasMapper";
import type { SampleCoaItem } from "@/types/coas";
import type { SearchCatalogNode } from "@/types/search";

const MAX_RESULTS = 10;

// Lower-case and split on spaces, so "glp 30" becomes ["glp", "30"]
function toWords(text: string): string[] {
  return text.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function lotNumberOf(node: SearchCatalogNode): string {
  const entry = (node.metaData ?? []).find((m) => m.key === COA_LOT_META_KEY);
  return entry?.value ?? "";
}

// Every typed word must appear in the product name or its lot number
function matchesAllWords(words: string[], node: SearchCatalogNode): boolean {
  const haystack = `${node.name} ${lotNumberOf(node)}`.toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export function searchCoas(nodes: SearchCatalogNode[], query: string): SampleCoaItem[] {
  const words = toWords(query);
  if (words.length === 0) return [];

  return nodes
    .filter((node) => matchesAllWords(words, node))
    .slice(0, MAX_RESULTS)
    // The number on the card is its place in this result list, like the live site
    .map((node, i) => toSampleCoa(node, i + 1))
    .filter((item): item is SampleCoaItem => item !== null);
}
