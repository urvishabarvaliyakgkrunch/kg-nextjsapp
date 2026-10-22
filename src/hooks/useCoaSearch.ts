// src/hooks/useCoaSearch.ts
"use client";

import { useLiveSearch, type LiveSearchState } from "@/hooks/useLiveSearch";
import { fetchCoaSearch } from "@/lib/searchApi";
import type { SampleCoaItem } from "@/types/coas";

const EMPTY: SampleCoaItem[] = [];

export type CoaSearchState = LiveSearchState<SampleCoaItem[]>;

// Words already searched in this tab are answered from memory, with no request at all
const memory = new Map<string, SampleCoaItem[]>();

export function useCoaSearch(rawQuery: string): CoaSearchState {
  return useLiveSearch(rawQuery, fetchCoaSearch, memory, EMPTY);
}
