// src/app/api/cart/totals/route.ts
// Prices the browser cart through WooCommerce and returns Subtotal / Discount / Total.
// Runs on the server so the WordPress URL and cart session never reach the browser.

import { NextResponse } from "next/server";
import { calculateCartTotals, type ShadowLine } from "@/lib/coupon";
import { readSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/cartSession";
import { getShopper } from "@/lib/shopper";

interface Body {
  lines?: { variationId?: unknown; quantity?: unknown }[];
  codes?: unknown[];
}

const MAX_LINES = 50;

// Woo adds every line one by one, so a big cart can pass the host's short default limit
export const maxDuration = 60;

function readLines(body: Body): ShadowLine[] {
  return (body.lines ?? [])
    .slice(0, MAX_LINES)
    .map((l) => ({
      variationId: Number(l.variationId),
      quantity: Number(l.quantity),
    }))
    .filter((l) => l.variationId > 0 && l.quantity > 0);
}

function readCodes(body: Body): string[] {
  return (body.codes ?? [])
    .map((c) => String(c).trim())
    .filter((c) => c.length > 0 && c.length <= 64);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const started = Date.now();
    const codes = readCodes(body);
    // Only asked when a code is present — it costs one extra WordPress call
    const shopper = codes.length > 0 ? await getShopper() : null;

    const identified = Date.now();
    const { totals, rejected, session } = await calculateCartTotals(
      readLines(body),
      codes,
      readSession(request),
      shopper
    );

    // Dev-terminal timing, so a slow cart can be blamed on the right step
    console.info(
      `[cart] who ${identified - started}ms, price ${Date.now() - identified}ms, signedIn=${Boolean(shopper)}`
    );

    const response = NextResponse.json({ totals, rejected });
    if (session) {
      response.cookies.set({
        name: SESSION_COOKIE,
        value: `${session.nonce}|${session.token}`,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
    }
    return response;
  } catch (error) {
    console.error("[cart] totals failed:", error);
    // Backend down should not break the cart page — the UI falls back to a local subtotal
    return NextResponse.json(
      { error: "Could not reach the store right now." },
      { status: 502 }
    );
  }
}
