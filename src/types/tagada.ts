// src/types/tagada.ts
// Shape of the TagadaPay INIT_CHECKOUT payload and the API answers we read.
// Field names and units copy the official WooCommerce plugin v3.2.0 exactly —
// changing a unit here silently charges the shopper the wrong amount.

// ── Pieces of the checkoutInit payload ───────────

export interface TagadaLineItem {
  externalVariantId: string; // Woo variation ID as a string
  quantity: number;
}

export interface TagadaCustomer {
  currency: string;
  locale: string;
  // Only present for a signed-in shopper — same fields tgd_build_customer() sends
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Amount is in MAJOR units (19.8 means $19.80) — same as the plugin
export interface TagadaPromotion {
  code: string;
  amount: number;
  currency: string;
}

// Amount is in MAJOR units, ex-tax — same as the plugin
export interface TagadaOrderBump {
  name: string;
  amount: number;
  currency: string;
  quantity: number;
}

// Amount is in MINOR units (1980 means $19.80) — the plugin really does differ
// from the two types above here, so keep it
export interface TagadaShipping {
  amount: number;
  currency: string;
}

export interface TagadaCustomerMetadata {
  cookies: Record<string, string>;
  queryParams: string;
}

export interface TagadaCheckoutInit {
  cartToken: string;
  lineItems: TagadaLineItem[];
  customer: TagadaCustomer;
  returnUrl: string;
  storeId: string;
  metadata: Record<string, never>;
  customerMetadata: TagadaCustomerMetadata;
  discountCodes?: string[];
  dynamicPromotions?: TagadaPromotion[];
  customOrderBumps?: TagadaOrderBump[];
  externalShipping?: TagadaShipping;
}

// Everything tgd_build_cart_data() returns, before the payload is assembled
export interface TagadaCartData {
  cartToken: string;
  lineItems: TagadaLineItem[];
  customer: TagadaCustomer;
  discountCodes: string[];
  dynamicPromotions: TagadaPromotion[];
  customOrderBumps: TagadaOrderBump[];
  externalShipping: TagadaShipping | null;
}

// ── API answers ──────────────────────────────────

export interface TagadaAnonSession {
  token?: string;
  sessionId?: string;
}

// What the session token itself says. Tagada checks the funnel call against
// these, so they win over anything a cookie claims.
export interface TagadaClaims {
  customerId: string;
  sessionId: string;
  storeId: string;
}

export interface TagadaInitSession {
  customer?: { id?: string };
}

export interface TagadaFunnelInit {
  context?: { sessionId?: string };
}

export interface TagadaNavigate {
  result?: { url?: string };
}

// Browser session the tracker stores in cookies, read back at checkout
export interface TagadaSession {
  token: string;
  customerId: string;
  sessionId: string;
}

// ── Our own /api/tagada/checkout contract ────────

export interface CheckoutStartRequest {
  lines: { variationId: number; quantity: number }[];
  codes: string[];
}

export interface CheckoutStartResponse {
  url?: string;
  error?: string;
}
