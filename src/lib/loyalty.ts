// src/lib/loyalty.ts
// Server-only. The only file that talks to the Elixser Loyalty API plugin.
// Never import this from a "use client" file — it carries the shared secret.

import { cacheLife } from "next/cache";
import type {
  LoyaltyActionResult,
  LoyaltyCartPoints,
  LoyaltyCoupons,
  LoyaltyHistory,
  LoyaltyProductPoints,
  LoyaltyReferralClaim,
  LoyaltySettings,
  LoyaltySummary,
} from "@/types/loyalty";

const BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/elx/v1/loyalty`;
const SECRET = process.env.ELX_LOYALTY_SECRET ?? "";

// Product points change only when a price or a campaign changes, so they cache like the catalog
export const LOYALTY_TAG = "loyalty";
const PRODUCT_POINTS_TTL = 3600;

// A slow backend must never hold a page open — the UI simply hides the loyalty line instead
const REQUEST_TIMEOUT_MS = 8_000;

interface CallOptions {
  // The shopper's WordPress login. Preferred, because it names them without a lookup here.
  authToken?: string;
  // Server-to-server naming, for the times we hold an email but no fresh token.
  email?: string;
  // Lets WordPress price the cart the shopper already built through the Store API
  cartToken?: string;
  body?: Record<string, unknown>;
  revalidate?: number;
}

function headers(options: CallOptions): HeadersInit {
  const sent: Record<string, string> = { "Content-Type": "application/json" };
  if (options.authToken) sent.Authorization = `Bearer ${options.authToken}`;
  if (options.email && SECRET) sent["X-Elx-Loyalty-Secret"] = SECRET;
  if (options.cartToken) sent["Cart-Token"] = options.cartToken;
  return sent;
}

function url(path: string, options: CallOptions): string {
  const target = new URL(`${BASE}${path}`);
  if (options.email) target.searchParams.set("email", options.email);
  return target.toString();
}

/**
 * One request to the plugin. Anything that is about a named shopper is never cached,
 * for the same reason account GraphQL is not: one person's balance must not be served
 * to the next visitor.
 */
async function call<T>(
  path: string,
  options: CallOptions = {}
): Promise<T | null> {
  const perShopper =
    Boolean(options.authToken) || Boolean(options.email) || Boolean(options.cartToken);

  try {
    const res = await fetch(url(path, options), {
      method: options.body ? "POST" : "GET",
      headers: headers(options),
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: perShopper
        ? { revalidate: 0 }
        : { revalidate: options.revalidate ?? PRODUCT_POINTS_TTL, tags: [LOYALTY_TAG] },
    });

    if (!res.ok) {
      // Without this line a failed call looks identical to "no data" in the terminal
      console.warn(`[loyalty] ${path} failed: HTTP ${res.status}`, await res.text().catch(() => ""));
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    // 503 when WPLoyalty is off, 401 when the secret is wrong, timeout when WP is slow.
    // In every case the caller shows nothing rather than a wrong number.
    console.warn(`[loyalty] ${path} threw:`, error);
    return null;
  }
}

// Older plugin versions send no settings block — treat the birthday as editable then
const DEFAULT_SETTINGS: LoyaltySettings = { emailOptIn: false, birthday: "", birthdayEditable: true };

// WordPress builds the link on its own host; a friend must land on the storefront instead
function toStorefrontReferral(
  referral: LoyaltySummary["referral"] | undefined
): LoyaltySummary["referral"] {
  if (!referral?.code) return { code: "", url: "" };
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return referral;

  const link = new URL(referral.url || "/", site);
  const origin = new URL(site);
  link.protocol = origin.protocol;
  link.host = origin.host;
  if (!link.searchParams.has("wlr_ref")) link.searchParams.set("wlr_ref", referral.code);
  return { code: referral.code, url: link.toString() };
}

/** Balance, tier, rewards, referral code and the ways to earn — one call. */
export async function getLoyaltySummary(
  authToken: string
): Promise<LoyaltySummary | null> {
  const summary = await call<LoyaltySummary>("/me", { authToken });
  if (!summary) return null;

  // An older plugin on WordPress omits these fields — fill them so the page never crashes
  return {
    ...summary,
    rewards: summary.rewards ?? [],
    waysToEarn: summary.waysToEarn ?? [],
    usedRewards: summary.usedRewards ?? { count: 0, value: 0 },
    settings: { ...DEFAULT_SETTINGS, ...summary.settings },
    couponCount: summary.couponCount ?? 0,
    referral: toStorefrontReferral(summary.referral),
  };
}

export function getLoyaltyHistory(
  authToken: string,
  page = 1,
  perPage = 10
): Promise<LoyaltyHistory | null> {
  return call<LoyaltyHistory>(`/history?page=${page}&per_page=${perPage}`, {
    authToken,
  });
}

/** One page of claimed coupons: "active" is the Coupons tab, "expired" is Used & Expired. */
export function getLoyaltyCoupons(
  authToken: string,
  type: "active" | "expired",
  page = 1,
  perPage = 5
): Promise<LoyaltyCoupons | null> {
  return call<LoyaltyCoupons>(
    `/coupons?type=${type}&page=${page}&per_page=${perPage}`,
    { authToken }
  );
}

/** Saves the notification tick box, the birthday, or both in one request. */
export function saveLoyaltySettings(
  authToken: string,
  changes: { emailOptIn?: boolean; birthday?: string; campaignId?: number }
): Promise<{ saved: string[] } | null> {
  return call<{ saved: string[] }>("/settings", {
    authToken,
    body: {
      email_opt_in: changes.emailOptIn,
      birthday: changes.birthday,
      campaign_id: changes.campaignId,
    },
  });
}

/** Points for one product or variation. Public, so this answer is shared and cached. */
export function getProductPoints(
  productId: number
): Promise<LoyaltyProductPoints | null> {
  return call<LoyaltyProductPoints>(`/product-points?product_id=${productId}`);
}

/**
 * Points for several variations in one request — a product page shows three bundle tiers
 * at once and three separate calls would be three round trips for the same answer.
 */
export async function getProductPointsMany(
  productIds: number[]
): Promise<Map<number, LoyaltyProductPoints>> {
  const wanted = productIds.filter((id) => id > 0);
  if (wanted.length === 0) return new Map();

  const result = await call<{ items: LoyaltyProductPoints[] }>(
    `/product-points?product_ids=${wanted.join(",")}`
  );

  return new Map((result?.items ?? []).map((item) => [item.productId, item]));
}

/**
 * The product page only needs each variation's message, so this is the cached form of the call above.
 * A plain object (not a Map) so it can be stored in the cache.
 */
export async function getProductPointsMessages(
  productIds: number[]
): Promise<Record<number, string>> {
  "use cache";
  cacheLife("hours");
  const points = await getProductPointsMany(productIds);
  // An empty answer usually means WordPress was slow, so do not keep it long
  if (points.size === 0) cacheLife("seconds");
  return Object.fromEntries([...points].map(([id, item]) => [id, item.message]));
}

/**
 * What the shopper's current cart will earn. Needs the Store API cart token so WordPress
 * counts the very same cart, plus the login so it knows whose balance to report.
 */
export function getCartPoints(
  cartToken: string,
  authToken: string
): Promise<LoyaltyCartPoints | null> {
  return call<LoyaltyCartPoints>("/cart-points", { cartToken, authToken });
}

/**
 * Spend points on a reward. WordPress creates the WooCommerce coupon, which is what makes
 * the discount reach Tagada — a code invented here would never get there.
 */
export function redeemReward(
  authToken: string,
  rewardId: number,
  rewardTable: string,
  points: number
): Promise<LoyaltyActionResult | null> {
  return call<LoyaltyActionResult>("/redeem", {
    authToken,
    body: { reward_id: rewardId, reward_table: rewardTable, points },
  });
}

/** Hand a reward back and get the points returned. */
export function revokeReward(
  authToken: string,
  userRewardId: number
): Promise<LoyaltyActionResult | null> {
  return call<LoyaltyActionResult>("/revoke", {
    authToken,
    body: { user_reward_id: userRewardId },
  });
}

/** Link this shopper to the friend whose ?wlr_ref code brought them here. */
export function claimReferral(
  authToken: string,
  code: string
): Promise<LoyaltyReferralClaim | null> {
  return call<LoyaltyReferralClaim>("/referral/claim", {
    authToken,
    body: { code },
  });
}
