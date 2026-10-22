// src/app/api/loyalty/rewards/route.ts
// Feeds the cart's rewards popup: points summary + active coupons in one request.

import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { getLoyaltyCoupons, getLoyaltySummary } from "@/lib/loyalty";
import type { LoyaltyRewardsPopup } from "@/types/loyalty";

// The popup has no pager, so ask for enough coupons to fit them all
const COUPONS_LIMIT = 20;

export async function GET() {
  const authToken = await getAuthToken().catch(() => null);
  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // The two calls do not depend on each other, so run them together
  const [summary, coupons] = await Promise.all([
    getLoyaltySummary(authToken),
    getLoyaltyCoupons(authToken, "active", 1, COUPONS_LIMIT),
  ]);

  // Without a summary there is nothing true to show — never fake zeros
  if (!summary) {
    return NextResponse.json({ error: "Not available" }, { status: 502 });
  }

  const body: LoyaltyRewardsPopup = { summary, coupons };
  return NextResponse.json(body);
}
