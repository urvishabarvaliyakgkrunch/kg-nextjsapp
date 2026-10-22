// src/app/api/cart/tiers/route.ts
// Fills in the bottle tiers for cart lines saved before the stepper existed,
// so an old localStorage cart still gets the 1/2/3-bottle control.

import { NextResponse } from "next/server";
import { getProductTiers } from "@/lib/queries/tiers";

interface Body {
  productIds?: unknown[];
}

const MAX_PRODUCTS = 50;

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
    .slice(0, MAX_PRODUCTS);

  try {
    const tiers = await getProductTiers(productIds);
    return NextResponse.json({ tiers });
  } catch {
    // Backfill is best effort — the cart still works without it
    return NextResponse.json({ tiers: {} });
  }
}
