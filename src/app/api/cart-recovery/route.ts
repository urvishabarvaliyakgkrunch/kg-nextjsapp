// src/app/api/cart-recovery/route.ts
// Saves or forgets the signed-in shopper's cart for abandoned-cart emails.

import { NextResponse } from "next/server";
import { getShopper } from "@/lib/shopper";
import { captureCart, cleanLines, forgetCart } from "@/lib/cartRecovery";

// The email always comes from the login, never from the request body,
// so nobody can save a cart under somebody else's address.
export async function POST(request: Request) {
  const shopper = await getShopper();
  if (!shopper) return NextResponse.json({ captured: false });

  const body = (await request.json().catch(() => ({}))) as { lines?: unknown };
  const lines = cleanLines(body.lines);
  if (lines.length === 0) return NextResponse.json({ captured: false });

  const captured = await captureCart(shopper.email, lines);
  return NextResponse.json({ captured });
}

export async function DELETE() {
  const shopper = await getShopper();
  if (shopper) await forgetCart(shopper.email);
  return NextResponse.json({ removed: true });
}
