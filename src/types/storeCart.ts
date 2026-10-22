// src/types/storeCart.ts
// Shape of the WooCommerce Store API cart response — only the fields we read.

export interface StoreMoney {
  total_items: string;
  total_discount: string;
  total_shipping: string;
  total_tax: string;
  total_price: string;
  currency_code: string;
  currency_minor_unit: number;
}

export interface StoreCoupon {
  code: string;
  discount_type: string;
  totals: { total_discount: string };
}

export interface StoreShippingRate {
  name: string;
  price: string;
  selected: boolean;
}

export interface StoreShippingPackage {
  destination: { state: string; country: string };
  shipping_rates: StoreShippingRate[];
}

// A cart line. `prices.price` is what the shopper pays after pricing plugins
// run; the clean catalogue price comes from GET /products/<id> instead.
export interface StoreCartItem {
  id: number;
  quantity: number;
  prices: { price: string; regular_price: string; currency_minor_unit: number };
  totals: { line_subtotal: string; line_total: string };
}

// A WooCommerce cart fee. `totals.total` is ex-tax, in minor units.
export interface StoreFee {
  id: string;
  name: string;
  totals: { total: string; total_tax: string };
}

export interface StoreCart {
  items: StoreCartItem[];
  coupons: StoreCoupon[];
  fees: StoreFee[];
  totals: StoreMoney;
  needs_shipping: boolean;
  has_calculated_shipping: boolean;
  shipping_rates: StoreShippingPackage[];
}

// GET /wc/store/v1/products/<id> — the catalogue price, before any cart filter
export interface StoreProductPrice {
  id: number;
  prices: { price: string; regular_price: string; currency_minor_unit: number };
}

// POST /wc/store/v1/batch — one call runs many cart writes and reports each result
export interface StoreBatchResponse {
  responses: { status: number; body: unknown }[];
}
