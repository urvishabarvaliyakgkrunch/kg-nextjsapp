// src/lib/coupon.ts
// Server-only. Builds a throwaway WooCommerce cart through the Store API so Woo
// itself works out discounts, shipping and totals — we never redo that math here.

import type {
  CartTotals,
  CartTotalsResult,
  RejectedCoupon,
} from "@/types/cart";
import type { StoreBatchResponse, StoreCart } from "@/types/storeCart";
import { decodeEntities, toMoney } from "./storeCart";
import type { Shopper } from "./shopper";

const BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/store/v1`;

// A stuck WordPress must end in the cart's offline fallback, not an endless "Checking…"
const STORE_TIMEOUT_MS = 25_000;

export interface ShadowLine {
  variationId: number;
  quantity: number;
}

// Nonce + Cart-Token identify one shopper's Woo cart session
export interface StoreSession {
  nonce: string;
  token: string;
}

export interface PricedCart extends CartTotalsResult {
  session: StoreSession | null;
}

// Same priced cart, but handing back Woo's raw answer. Tagada needs fees,
// per-line prices and shipping flags that the trimmed CartTotals drops.
export interface RawPricedCart {
  cart: StoreCart | null;
  rejected: RejectedCoupon[];
  session: StoreSession | null;
}

const EMPTY_TOTALS: CartTotals = {
  subtotal: 0,
  discount: 0,
  coupons: [],
  shipping: 0,
  shippingName: "",
  shippingState: "",
  total: 0,
};

// Store API rejects every write without this pair, so grab them from a plain GET
// The nonce is tied to who asks, so a signed-in shopper opens the session signed in too
function authHeader(shopper: Shopper | null): Record<string, string> {
  return shopper ? { Authorization: `Bearer ${shopper.authToken}` } : {};
}

export async function openSession(shopper: Shopper | null = null): Promise<StoreSession> {
  const res = await fetch(`${BASE}/cart`, {
    cache: "no-store",
    headers: authHeader(shopper),
    signal: AbortSignal.timeout(STORE_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Store API cart failed: ${res.status}`);
  return {
    nonce: res.headers.get("Nonce") ?? "",
    token: res.headers.get("Cart-Token") ?? "",
  };
}

// Woo puts the shopper-friendly reason in data.details.cart, the generic one in message
function readError(body: unknown): string {
  const error = body as {
    message?: string;
    data?: { details?: { cart?: string } };
  };
  return decodeEntities(
    error.data?.details?.cart ?? error.message ?? "Coupon could not be applied."
  );
}

function readTotals(cart: StoreCart): CartTotals {
  const minor = cart.totals.currency_minor_unit ?? 2;
  const shipment = cart.shipping_rates?.[0];
  const rate =
    shipment?.shipping_rates?.find((r) => r.selected) ??
    shipment?.shipping_rates?.[0];

  return {
    subtotal: toMoney(cart.totals.total_items, minor),
    discount: toMoney(cart.totals.total_discount, minor),
    coupons: cart.coupons.map((c) => ({
      code: c.code.toUpperCase(),
      discount: toMoney(c.totals.total_discount, minor),
    })),
    shipping: toMoney(cart.totals.total_shipping, minor),
    shippingName: rate?.name ?? "",
    shippingState: shipment?.destination?.state ?? "",
    total: toMoney(cart.totals.total_price, minor),
  };
}

// Emptying the cart first also drops any coupon left from the previous call,
// so one reusable session can price many different carts.
function buildRequests(
  lines: ShadowLine[],
  codes: string[],
  email: string | null
) {
  // Email-locked coupons (WPLoyalty rewards) are refused unless the cart knows the shopper
  const identify =
    email && codes.length > 0
      ? [
          {
            path: "/wc/store/v1/cart/update-customer",
            method: "POST",
            body: { billing_address: { email } },
          },
        ]
      : [];

  return [
    { path: "/wc/store/v1/cart/items", method: "DELETE" },
    ...lines.map((line) => ({
      path: "/wc/store/v1/cart/add-item",
      method: "POST",
      body: { id: line.variationId, quantity: line.quantity },
    })),
    ...identify,
    ...codes.map((code) => ({
      path: "/wc/store/v1/cart/apply-coupon",
      method: "POST",
      body: { code },
    })),
  ];
}

// WooCommerce's Store API /batch endpoint refuses more than 25 requests in one call
// ("requests must contain at most 25 items", confirmed against the live store). A cart's
// DELETE + one add-item per line crosses that past ~24 lines, which is what made large
// carts fail to start checkout (H4). Chunks run in order, on the same cart session, since
// each add-item depends on the DELETE (and earlier chunks) having already landed.
const BATCH_CHUNK_SIZE = 25;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function runBatch(
  session: StoreSession,
  requests: ReturnType<typeof buildRequests>,
  shopper: Shopper | null
): Promise<StoreBatchResponse> {
  const responses: StoreBatchResponse["responses"] = [];
  for (const part of chunk(requests, BATCH_CHUNK_SIZE)) {
    const res = await fetch(`${BASE}/batch`, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(STORE_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        Nonce: session.nonce,
        "Cart-Token": session.token,
        ...authHeader(shopper),
      },
      body: JSON.stringify({ requests: part }),
    });

    if (!res.ok) throw new Error(`Store API batch failed: ${res.status}`);
    const batch = (await res.json()) as StoreBatchResponse;
    responses.push(...(batch.responses ?? []));
  }
  return { responses };
}

// Fills a Woo cart with the shopper's lines, then applies each code, and hands
// back Woo's own answer. All writes go in one /batch call, and a cached session
// skips the opening GET.
export async function priceCart(
  lines: ShadowLine[],
  codes: string[],
  cached: StoreSession | null = null,
  shopper: Shopper | null = null
): Promise<RawPricedCart> {
  if (lines.length === 0) {
    return { cart: null, rejected: [], session: cached };
  }

  const requests = buildRequests(lines, codes, shopper?.email ?? null);
  let session = cached ?? (await openSession(shopper));
  let batch: StoreBatchResponse;
  try {
    batch = await runBatch(session, requests, shopper);
  } catch (error) {
    if (!cached) throw error;
    // A cached nonce is refused after a few hours or after signing in — start fresh once
    session = await openSession(shopper);
    batch = await runBatch(session, requests, shopper);
  }

  const first = batch.responses?.[0]?.status;
  if ((first === 401 || first === 403) && cached) {
    session = await openSession(shopper);
    batch = await runBatch(session, requests, shopper);
  }

  const responses = batch.responses ?? [];
  // DELETE, the add-item calls and the optional update-customer come before the coupons
  const couponOffset = requests.length - codes.length;

  const rejected: RejectedCoupon[] = [];
  codes.forEach((code, index) => {
    const answer = responses[couponOffset + index];
    if (answer && answer.status >= 400) {
      rejected.push({ code, message: readError(answer.body) });
    }
  });

  // Every successful write returns the whole cart, so the last good one is final
  const priced = [...responses]
    .reverse()
    .find((r) => r.status < 400 && (r.body as StoreCart)?.totals);

  return {
    cart: priced ? (priced.body as StoreCart) : null,
    rejected,
    session,
  };
}

// Cart page view: the same priced cart, trimmed to what the summary box shows.
export async function calculateCartTotals(
  lines: ShadowLine[],
  codes: string[],
  cached: StoreSession | null = null,
  shopper: Shopper | null = null
): Promise<PricedCart> {
  const { cart, rejected, session } = await priceCart(lines, codes, cached, shopper);
  return {
    totals: cart ? readTotals(cart) : EMPTY_TOTALS,
    rejected,
    session,
  };
}
