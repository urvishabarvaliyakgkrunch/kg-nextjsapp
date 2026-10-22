// src/lib/tagada/config.ts
// The four IDs the official plugin hardcodes, read from env instead.
// They are printed into every page by the tracker, so they are public values.

export const TAGADA = {
  apiUrl: (process.env.NEXT_PUBLIC_TAGADA_API_URL ?? "https://api.tagada.io").replace(
    /\/$/,
    ""
  ),
  storeId: process.env.NEXT_PUBLIC_TAGADA_STORE_ID ?? "",
  accountId: process.env.NEXT_PUBLIC_TAGADA_ACCOUNT_ID ?? "",
  funnelId: process.env.NEXT_PUBLIC_TAGADA_FUNNEL_ID ?? "",
  stepId: process.env.NEXT_PUBLIC_TAGADA_STEP_ID ?? "",
  debug: process.env.NEXT_PUBLIC_TAGADA_DEBUG === "true",
} as const;

// Plugin version we ported from — Tagada reads it from a request header and
// uses it to tell plugin builds apart in their logs
export const TAGADA_PLUGIN_VERSION = "3.2.0";

export const TAGADA_TRACKER_URL = `${TAGADA.apiUrl}/assets/js/external-tracker.min.js`;

// Marker we put on the return URL so we know a shopper came back from a paid
// Tagada checkout. Deliberately NOT the plugin's `tgd_success` — that one
// belongs to the WordPress flow, where Tagada's own redirect already empties
// the Woo cart. Ours has to stay distinct or the two get mixed up.
export const RETURN_PARAM = "elx_order_complete";
export const RETURN_VALUE = "1";

// Where Tagada sends the shopper back to once the order is paid
export function buildReturnUrl(): string {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return `${site}/?${RETURN_PARAM}=${RETURN_VALUE}`;
}

// Cookies the tracker writes in the browser and the checkout route reads back
export const TGD_COOKIE = {
  token: "tgd_token",
  customerId: "tgd_customer_id",
  funnelSessionId: "tgd_funnel_session_id",
  storeId: "tgd_store_id",
  trackingMeta: "tgd_tracking_meta",
  draft: "tgd_draft",
} as const;

// Missing IDs mean every Tagada call would 4xx — fail loudly in one place
export function isTagadaConfigured(): boolean {
  return Boolean(
    TAGADA.storeId && TAGADA.accountId && TAGADA.funnelId && TAGADA.stepId
  );
}
