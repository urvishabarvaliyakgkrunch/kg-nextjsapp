// src/app/api/tagada/checkout/route.ts
// Turns the browser cart into a TagadaPay checkout URL.
// Runs on the server so the WordPress URL, the Woo cart session and the
// shopper's cookies never have to be handled in the browser.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { StoreSession } from "@/lib/coupon";
import {
  collectForwardableCookies,
  startCheckout,
  withTrackingParams,
} from "@/lib/tagada/checkout";
import { getShopper } from "@/lib/shopper";
import { TagadaError } from "@/lib/tagada/api";
import { isTagadaConfigured, TAGADA, TGD_COOKIE } from "@/lib/tagada/config";
import type { CheckoutStartRequest } from "@/types/tagada";

const MAX_LINES = 50;
const CART_SESSION_COOKIE = "elx_cart_session";
const CART_SESSION_MAX_AGE = 60 * 60 * 6;

function readLines(body: Partial<CheckoutStartRequest>) {
  return (body.lines ?? [])
    .slice(0, MAX_LINES)
    .map((l) => ({
      variationId: Number(l.variationId),
      quantity: Number(l.quantity),
    }))
    .filter((l) => l.variationId > 0 && l.quantity > 0);
}

function readCodes(body: Partial<CheckoutStartRequest>) {
  return (body.codes ?? [])
    .map((c) => String(c).trim())
    .filter((c) => c.length > 0 && c.length <= 64);
}

// The Woo cart session is stored as "<nonce>|<cart-token>" in one cookie
function readStoreSession(raw: string | undefined): StoreSession | null {
  if (!raw) return null;
  const [nonce, token] = raw.split("|");
  return nonce && token ? { nonce, token } : null;
}

// The tracker saves the landing page's ad params here so a later page view
// cannot lose them
function readQueryParams(raw: string | undefined): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as { queryParams?: string };
    return parsed.queryParams ?? "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  if (!isTagadaConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 503 }
    );
  }

  let body: Partial<CheckoutStartRequest>;
  try {
    body = (await request.json()) as Partial<CheckoutStartRequest>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lines = readLines(body);
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const jar = await cookies();
  const all = Object.fromEntries(jar.getAll().map((c) => [c.name, c.value]));

  // Cookies left over from a different Tagada store would point the checkout
  // at the wrong account, so throw them away and start a fresh session
  const sameStore = all[TGD_COOKIE.storeId] === TAGADA.storeId;

  const base = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`;
  const queryParams = readQueryParams(all[TGD_COOKIE.trackingMeta]);

  try {
    const { url, storeSession } = await startCheckout({
      lines,
      codes: readCodes(body),
      storeSession: readStoreSession(all[CART_SESSION_COOKIE]),
      shopper: await getShopper(),
      token: sameStore ? (all[TGD_COOKIE.token] ?? null) : null,
      funnelSessionId: sameStore
        ? (all[TGD_COOKIE.funnelSessionId] ?? null)
        : null,
      cookies: collectForwardableCookies(all),
      queryParams,
      draft: all[TGD_COOKIE.draft] === "true",
      currentUrl: withTrackingParams(base, queryParams),
    });

    const response = NextResponse.json({ url });

    if (storeSession) {
      response.cookies.set({
        name: CART_SESSION_COOKIE,
        value: `${storeSession.nonce}|${storeSession.token}`,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: CART_SESSION_MAX_AGE,
      });
    }

    // This session is spent — clear it so the next checkout gets a fresh one,
    // exactly as the plugin does after a successful redirect
    for (const name of [
      TGD_COOKIE.token,
      TGD_COOKIE.customerId,
      TGD_COOKIE.funnelSessionId,
      TGD_COOKIE.storeId,
    ]) {
      response.cookies.set({ name, value: "", path: "/", maxAge: 0 });
    }

    return response;
  } catch (cause) {
    // Tagada answers a bad payload with a 4xx body that names the field. Losing
    // that body leaves nothing to debug, so always write it to the server log.
    const detail = cause instanceof TagadaError ? cause.detail : undefined;
    console.error("[tagada] checkout failed:", cause, JSON.stringify(detail));

    // The plugin can quietly fall back to the Woo checkout page; we have none,
    // so the shopper has to be told
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 }
    );
  }
}
