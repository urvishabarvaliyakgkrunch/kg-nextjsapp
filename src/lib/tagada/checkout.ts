// src/lib/tagada/checkout.ts
// Server-only. The whole checkout handover in one place: price the cart with
// WooCommerce, describe it the way Tagada expects, then ask Tagada for the
// hosted checkout URL. Port of woocommerce_checkout_with_tagadapay().

import { createHash } from "crypto";
import type { Shopper } from "../shopper";
import { priceCart, type ShadowLine, type StoreSession } from "../coupon";
import type { StoreCart } from "@/types/storeCart";
import type {
  TagadaCheckoutInit,
  TagadaClaims,
  TagadaCustomer,
  TagadaCustomerMetadata,
} from "@/types/tagada";
import {
  initFunnel,
  initSession,
  navigateCheckout,
  readTokenClaims,
  TagadaError,
} from "./api";
import { fetchCatalogPrices } from "./catalog";
import { buildReturnUrl, TAGADA } from "./config";
import {
  buildDynamicPromotions,
  buildExternalShipping,
  buildOrderBumps,
  sumBumps,
} from "./pricing";

// Woo's site language. The store is US-only, so this never varies today.
const LOCALE = "en-US";

export interface CheckoutContext {
  lines: ShadowLine[];
  codes: string[];
  storeSession: StoreSession | null;
  // Who is signed in, so account-locked coupons still apply when the cart is priced here
  shopper: Shopper | null;
  token: string | null;
  funnelSessionId: string | null;
  cookies: Record<string, string>;
  queryParams: string;
  draft: boolean;
  currentUrl: string;
}

export interface CheckoutResult {
  url: string;
  storeSession: StoreSession | null;
}

// An opaque but stable id for this shopper's cart. Tagada only compares it, so
// a hash of our Woo cart token does the same job as the plugin's.
function buildCartToken(session: StoreSession | null): string {
  const seed = session?.token ?? `anon_${Date.now()}`;
  return createHash("sha256").update(seed).digest("hex").slice(0, 32);
}

// Forward the shopper's ad cookies so Tagada can credit the right campaign.
// Our own cookies are stripped: tgd_* are Tagada's own session values, and
// elx_* include the WordPress login token, which must never leave this server.
export function collectForwardableCookies(
  all: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(all)) {
    if (name.startsWith("tgd_") || name.startsWith("elx_")) continue;
    out[name] = value;
  }
  return out;
}

// Tagada needs the ad-click params on the URL it records. Our checkout path is
// clean, so merge the ones the tracker saved back in.
export function withTrackingParams(base: string, queryParams: string): string {
  if (!queryParams) return base;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${queryParams.replace(/^\?/, "")}`;
}

/**
 * Decide which Tagada session this checkout runs on.
 *
 * The tracker's cookie token is preferred, because that session already
 * carries the shopper's real device and ad attribution. We read the customer
 * and session straight out of the token rather than from the other cookies: a
 * cookie can survive a token it no longer matches, and Tagada answers any
 * disagreement with a 403. An unreadable, expired or wrong-store token means
 * we start a fresh server-side session instead.
 */
async function resolveSession(
  cookieToken: string | null
): Promise<{ token: string; claims: TagadaClaims }> {
  if (cookieToken) {
    const claims = readTokenClaims(cookieToken);
    if (claims && claims.storeId === TAGADA.storeId) {
      return { token: cookieToken, claims };
    }
  }

  const session = await initSession(LOCALE);
  return {
    token: session.token,
    claims: {
      customerId: session.customerId,
      sessionId: session.sessionId,
      storeId: TAGADA.storeId,
    },
  };
}

// Port of tgd_build_customer() — without this, Tagada never learns who the shopper is,
// so every order (and every WPLoyalty point) lands on whatever anonymous customer the
// browser's tracker cookie happened to carry, not the signed-in WordPress account.
function buildTagadaCustomer(currency: string, shopper: Shopper | null): TagadaCustomer {
  const customer: TagadaCustomer = { currency, locale: LOCALE };
  if (!shopper) return customer;

  return {
    ...customer,
    email: shopper.email,
    ...(shopper.firstName ? { firstName: shopper.firstName } : {}),
    ...(shopper.lastName ? { lastName: shopper.lastName } : {}),
    ...(shopper.phone ? { phone: shopper.phone } : {}),
  };
}

// Codes the browser asked for that Woo did not put on the cart it priced
function missingCodes(cart: StoreCart | null, codes: string[]): string[] {
  const applied = new Set(
    (cart?.coupons ?? []).map((c) => c.code.toLowerCase())
  );
  return codes.filter((code) => !applied.has(code.trim().toLowerCase()));
}

// Session + funnel setup does not depend on the cart, so it runs alongside the
// Woo pricing. The route clears the tracker cookies after every handover, so a
// second checkout has to build both from scratch — done one after another with
// the pricing, that was four slow calls in a row.
async function prepareFunnel(
  context: CheckoutContext
): Promise<{ token: string; funnelSessionId: string }> {
  const { token, claims } = await resolveSession(context.token);

  // Only reuse the tracker's funnel session when it belongs to this token,
  // or Tagada rejects the navigate call
  const reusable = context.token === token ? context.funnelSessionId : null;
  const funnelSessionId =
    reusable ??
    (await initFunnel(claims, token, context.currentUrl, context.draft));

  return { token, funnelSessionId };
}

export async function startCheckout(
  context: CheckoutContext
): Promise<CheckoutResult> {
  const t0 = Date.now();
  const lap = (label: string) =>
    console.log(`[tagada-timing] ${label}: ${Date.now() - t0}ms`);
  const funnelPromise = prepareFunnel(context);
  funnelPromise.then(() => lap("funnel ready"), () => lap("funnel failed"));
  // If pricing fails first nobody awaits this, and a rejection would go unhandled
  funnelPromise.catch(() => {});

  // 1. Let WooCommerce price everything — we never redo its discount math
  let { cart, rejected, session: storeSession } = await priceCart(
    context.lines,
    context.codes,
    context.storeSession,
    context.shopper
  );

  lap("priced");

  // A coupon that never made it onto the priced cart cannot reach Tagada, and
  // the shopper would land on checkout quietly paying full price. The usual
  // cause is the cached Woo session: that cookie is six hours old and may have
  // been opened as a guest, which makes WPLoyalty refuse a code locked to this
  // account. One retry on a brand-new session is enough to rule that out.
  if (context.codes.length > 0 && missingCodes(cart, context.codes).length > 0) {
    const retry = await priceCart(context.lines, context.codes, null, context.shopper);
    if (retry.cart) ({ cart, rejected, session: storeSession } = retry);
  }

  const stillMissing = missingCodes(cart, context.codes);
  if (stillMissing.length > 0) {
    // Woo's own reason, so a coupon that silently vanishes can be explained
    console.warn(
      "[tagada] coupon not on the priced cart:",
      stillMissing.join(", "),
      JSON.stringify(rejected),
      `signedIn=${Boolean(context.shopper)}`
    );
  }

  if (!cart || (cart.items ?? []).length === 0) {
    throw new TagadaError("WooCommerce could not price this cart.");
  }

  // 2. Catalogue prices, so we can tell Tagada how much Woo already discounted
  const catalogPrices = await fetchCatalogPrices(cart.items.map((i) => i.id));

  lap("catalog");

  // Bumps are worked out first because the discount gap has to exclude them
  const customOrderBumps = buildOrderBumps(cart);
  const dynamicPromotions = buildDynamicPromotions(
    cart,
    catalogPrices,
    sumBumps(customOrderBumps)
  );
  const externalShipping = buildExternalShipping(cart);

  const customerMetadata: TagadaCustomerMetadata = {
    cookies: context.cookies,
    queryParams: context.queryParams,
  };

  const checkoutInit: TagadaCheckoutInit = {
    cartToken: buildCartToken(storeSession),
    // Tagada prices from its own catalogue, so only the variation and how many
    lineItems: cart.items.map((item) => ({
      externalVariantId: String(item.id),
      quantity: item.quantity,
    })),
    customer: buildTagadaCustomer(cart.totals.currency_code, context.shopper),
    returnUrl: buildReturnUrl(),
    storeId: TAGADA.storeId,
    metadata: {},
    customerMetadata,
  };

  // The plugin drops empty keys instead of sending nulls, so do the same
  const codes = cart.coupons?.map((c) => c.code) ?? [];
  if (codes.length > 0) checkoutInit.discountCodes = codes;
  if (dynamicPromotions.length > 0) {
    checkoutInit.dynamicPromotions = dynamicPromotions;
  }
  if (customOrderBumps.length > 0) {
    checkoutInit.customOrderBumps = customOrderBumps;
  }
  if (externalShipping) checkoutInit.externalShipping = externalShipping;

  // 3. Session and funnel, already prepared while Woo was pricing
  const { token, funnelSessionId } = await funnelPromise;

  // 4. Hand the cart over. This returns a URL; the order only exists once the
  // shopper pays on that page.
  const url = await navigateCheckout(
    funnelSessionId,
    checkoutInit,
    token,
    context.currentUrl
  );

  lap("navigated");

  return { url, storeSession };
}
