// src/app/api/search/route.ts
// Header search endpoint. Server-side so the GraphQL URL and its cache stay out of the browser.

import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from "@/lib/queries/search";

// Stops someone pasting a huge string into the box
const MAX_QUERY_LENGTH = 60;

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);
  if (!query) return NextResponse.json({ categories: [], products: [] });

  try {
    return NextResponse.json(await getSearchResults(query));
  } catch {
    // Search is a nice-to-have: an error shows "no results" instead of breaking the header
    return NextResponse.json({ categories: [], products: [] }, { status: 502 });
  }
}
