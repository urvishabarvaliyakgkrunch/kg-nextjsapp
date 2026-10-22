// src/app/api/cart/fbt/route.ts
// Returns the "Frequently Bought Together" picks for whatever is in the cart.
// Server-side so the GraphQL endpoint and its cache stay out of the browser.

import { NextResponse } from "next/server";
import { getFbtSuggestions } from "@/lib/queries/fbt";

interface Body {
  productIds?: unknown[];
}

const MAX_CART_PRODUCTS = 20;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const productIds = (body.productIds ?? [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0)
    .slice(0, MAX_CART_PRODUCTS);

  try {
    const suggestions = await getFbtSuggestions(productIds);
    return NextResponse.json({ suggestions });
  } catch {
    // Suggestions are a nice-to-have — an empty list just hides the block
    return NextResponse.json({ suggestions: [] });
  }
}
