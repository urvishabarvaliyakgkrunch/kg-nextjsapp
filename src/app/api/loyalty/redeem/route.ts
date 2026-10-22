// src/app/api/loyalty/redeem/route.ts
// Client-side redeem request comes here, we add the auth token server-side and forward to WP.

import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { redeemReward } from "@/lib/loyalty";

export async function POST(req: NextRequest) {
  const authToken = await getAuthToken();
  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json() as {
    rewardId: number;
    rewardTable: string;
    points: number;
  };

  const result = await redeemReward(
    authToken,
    body.rewardId,
    body.rewardTable,
    body.points
  );

  if (!result?.success) {
    return NextResponse.json(
      { error: result?.message ?? "Redeem failed" },
      { status: 400 }
    );
  }

  // A coupon that never reaches Tagada is invisible at the hosted checkout, so say so here
  console.info(`[loyalty] redeem ${result.code} — tagada: ${result.tagada ?? "not reported"}`);

  return NextResponse.json({ points: result.points, code: result.code });
}
