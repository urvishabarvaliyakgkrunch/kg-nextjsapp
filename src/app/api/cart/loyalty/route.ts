// src/app/api/cart/loyalty/route.ts
// Points the cart earns. Kept apart from pricing so the totals never wait on WPLoyalty.

import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { readSession } from "@/lib/cartSession";
import { getCartPoints } from "@/lib/loyalty";

export async function GET(request: Request) {
  // WordPress counts the cart that this Cart-Token belongs to
  const session = readSession(request);
  const authToken = await getAuthToken().catch(() => null);

  // A guest, or a cart WordPress has not seen yet, simply has no points to show
  if (!session?.token || !authToken) {
    return NextResponse.json({ loyalty: null });
  }

  const loyalty = await getCartPoints(session.token, authToken);
  return NextResponse.json({ loyalty });
}
