// src/lib/searchApi.ts
// Browser-side calls to our own /api/search routes. One place, so no component fetches directly.

import type { SampleCoaItem } from "@/types/coas";
import type { SearchResponse } from "@/types/search";

export async function fetchSearch(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error("Search failed.");
  return (await res.json()) as SearchResponse;
}

export async function fetchCoaSearch(query: string, signal?: AbortSignal): Promise<SampleCoaItem[]> {
  const res = await fetch(`/api/coa-search?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error("COA search failed.");
  return (await res.json()) as SampleCoaItem[];
}
