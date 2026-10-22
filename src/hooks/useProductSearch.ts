// src/hooks/useProductSearch.ts
"use client";

import { useLiveSearch, type LiveSearchState } from "@/hooks/useLiveSearch";
import { fetchSearch } from "@/lib/searchApi";
import type { SearchResponse } from "@/types/search";

const EMPTY: SearchResponse = { categories: [], products: [] };

export type SearchState = LiveSearchState<SearchResponse>;

// Words already searched in this tab are answered from memory, with no request at all
const memory = new Map<string, SearchResponse>();

export function useProductSearch(rawQuery: string): SearchState {
  return useLiveSearch(rawQuery, fetchSearch, memory, EMPTY);
}
