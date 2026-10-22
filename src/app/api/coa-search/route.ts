// src/app/api/coa-search/route.ts
// COA search endpoint (home + /coas). Server-side so the GraphQL URL and its cache stay out of the browser.

import { NextRequest, NextResponse } from "next/server";
import { getCoaSearchResults } from "@/lib/queries/search";

// Stops someone pasting a huge string into the box
const MAX_QUERY_LENGTH = 60;

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);
  if (!query) return NextResponse.json([]);

  try {
    return NextResponse.json(await getCoaSearchResults(query));
  } catch {
    // Search is a nice-to-have: an error shows "no results" instead of breaking the page
    return NextResponse.json([], { status: 502 });
  }
}
