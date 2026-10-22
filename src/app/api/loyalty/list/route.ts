// src/app/api/loyalty/list/route.ts
// One page of activity or coupons for the Prev / Next buttons.

import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { getLoyaltyCoupons, getLoyaltyHistory } from "@/lib/loyalty";

// Same size the page asks for on first load — wp-admin's Pagination Limit
const PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const authToken = await getAuthToken();
  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const kind = req.nextUrl.searchParams.get("kind");
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);

  const result =
    kind === "history"
      ? await getLoyaltyHistory(authToken, page, PER_PAGE)
      : kind === "active" || kind === "expired"
        ? await getLoyaltyCoupons(authToken, kind, page, PER_PAGE)
        : null;

  if (!result) return NextResponse.json({ error: "Not available" }, { status: 400 });
  return NextResponse.json(result);
}
