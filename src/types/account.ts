// src/types/account.ts
// Shapes returned by WPGraphQL + WooGraphQL for the logged-in customer.

// One address block — Woo keeps billing and shipping in the same shape,
// except billing also carries email + phone.
export interface GQLAddress {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  email?: string | null;
  phone?: string | null;
}

// Woo order status codes, e.g. PROCESSING / COMPLETED / CANCELLED
export type OrderStatus = string;

export interface GQLOrderLineItem {
  productId: number | null;
  variationId: number | null;
  quantity: number | null;
  total: string | null;
  product: { node: { name: string; slug: string; image?: { sourceUrl: string; altText: string } | null } } | null;
}

export interface GQLOrderSummary {
  id: string;
  databaseId: number;
  orderNumber: string;
  date: string | null;
  status: OrderStatus;
  total: string | null;
  lineItems?: { nodes: GQLOrderLineItem[] };
}

export interface GQLOrderDetail extends GQLOrderSummary {
  subtotal: string | null;
  shippingTotal: string | null;
  discountTotal: string | null;
  totalTax: string | null;
  paymentMethodTitle: string | null;
  customerNote: string | null;
  billing: GQLAddress | null;
  shipping: GQLAddress | null;
  lineItems: { nodes: GQLOrderLineItem[] };
}

export interface GQLCustomer {
  id: string;
  databaseId: number | null;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  orderCount: number | null;
  totalSpent: number | null;
  billing: GQLAddress | null;
  shipping: GQLAddress | null;
}

// What we keep in the signed-in cookie — never the password, never the user's name
export interface Session {
  authToken: string;
  refreshToken: string;
  // Unix seconds — when authToken stops working and we must refresh it
  expiresAt: number;
  // false = cookie dies when the browser closes ("Remember me" left unticked)
  remember: boolean;
}

// Every account form returns this, so one <FormMessage> component can render them all
export interface FormState {
  // Field name -> message, e.g. { email: "Enter a valid email" }
  fieldErrors?: Record<string, string>;
  // Red banner at the top of the form
  error?: string;
  // Green banner at the top of the form
  success?: string;
}
