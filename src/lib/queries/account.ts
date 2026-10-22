// src/lib/queries/account.ts
// All customer-scoped GraphQL. Every call needs the signed-in shopper's JWT.

import { gql } from "@/lib/graphql";
import type { GQLCustomer, GQLOrderDetail, GQLOrderSummary } from "@/types/account";

const ADDRESS_FIELDS = `
  firstName
  lastName
  company
  address1
  address2
  city
  state
  postcode
  country
`;

const CUSTOMER_FIELDS = `
  id
  databaseId
  username
  email
  firstName
  lastName
  displayName
  orderCount
  totalSpent
  billing { ${ADDRESS_FIELDS} email phone }
  shipping { ${ADDRESS_FIELDS} }
`;

const ORDER_SUMMARY_FIELDS = `
  id
  databaseId
  orderNumber
  date
  status
  total
`;

const GET_CUSTOMER = `
  query GetCustomer { customer { ${CUSTOMER_FIELDS} } }
`;

const GET_ORDERS = `
  query GetOrders($first: Int!) {
    customer {
      orders(first: $first) {
        nodes {
          ${ORDER_SUMMARY_FIELDS}
          lineItems { nodes { quantity } }
        }
      }
    }
  }
`;

const GET_ORDER = `
  query GetOrder($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      ${ORDER_SUMMARY_FIELDS}
      subtotal
      shippingTotal
      discountTotal
      totalTax
      paymentMethodTitle
      customerNote
      billing { ${ADDRESS_FIELDS} email phone }
      shipping { ${ADDRESS_FIELDS} }
      lineItems {
        nodes {
          productId
          variationId
          quantity
          total
          product { node { name slug image { sourceUrl altText } } }
        }
      }
    }
  }
`;

const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) { customer { ${CUSTOMER_FIELDS} } }
  }
`;

export async function getCustomer(authToken: string): Promise<GQLCustomer | null> {
  const data = await gql<{ customer: GQLCustomer | null }>(GET_CUSTOMER, {}, { authToken });
  // WooGraphQL answers "guest" instead of null when the token is not accepted
  if (!data.customer || data.customer.id === "guest") return null;
  return data.customer;
}

export async function getOrders(
  authToken: string,
  first = 20
): Promise<GQLOrderSummary[]> {
  const data = await gql<{ customer: { orders: { nodes: GQLOrderSummary[] } } | null }>(
    GET_ORDERS,
    { first },
    { authToken }
  );
  return data.customer?.orders.nodes ?? [];
}

export async function getOrder(
  authToken: string,
  databaseId: number
): Promise<GQLOrderDetail | null> {
  const data = await gql<{ order: GQLOrderDetail | null }>(
    GET_ORDER,
    { id: String(databaseId) },
    { authToken }
  );
  return data.order;
}

// Woo validates the fields and keeps its own hooks running — we only pass them through
export async function updateCustomer(
  authToken: string,
  input: Record<string, unknown>
): Promise<GQLCustomer> {
  const data = await gql<{ updateCustomer: { customer: GQLCustomer } }>(
    UPDATE_CUSTOMER,
    { input },
    { authToken }
  );
  return data.updateCustomer.customer;
}

const GET_LOCATIONS = `
  query GetLocations($country: CountriesEnum!) {
    allowedCountries
    countryStates(country: $country) { code name }
  }
`;

export interface LocationOptions {
  countries: string[];
  states: { code: string; name: string }[];
}

// Country and state lists come from WooCommerce settings, never from a hardcoded list
export async function getLocationOptions(country = "US"): Promise<LocationOptions> {
  const data = await gql<{
    allowedCountries: string[] | null;
    countryStates: { code: string; name: string }[] | null;
  }>(GET_LOCATIONS, { country }, { revalidate: 86400, tags: ["wc-locations"] });

  return {
    countries: data.allowedCountries ?? ["US"],
    states: data.countryStates ?? [],
  };
}

const GET_DOWNLOADS = `
  query GetDownloads {
    customer {
      downloadableItems {
        nodes {
          name
          downloadId
          downloadsRemaining
          accessExpires
          url
          product { name slug }
        }
      }
    }
  }
`;

export interface DownloadableItem {
  name: string;
  downloadId: string;
  downloadsRemaining: number | null;
  accessExpires: string | null;
  url: string | null;
  product: { name: string; slug: string } | null;
}

export async function getDownloads(authToken: string): Promise<DownloadableItem[]> {
  const data = await gql<{
    customer: { downloadableItems: { nodes: DownloadableItem[] } | null } | null;
  }>(GET_DOWNLOADS, {}, { authToken });
  return data.customer?.downloadableItems?.nodes ?? [];
}

// ── One call per page ────────────────────────────────────────────────
// Each signed-in page needs the customer (for the guard) plus its own data. Asking for
// both in a single document turns two slow WordPress round trips into one.

const GET_ORDERS_PAGE = `
  query GetOrdersPage($first: Int!) {
    customer {
      ${CUSTOMER_FIELDS}
      orders(first: $first) {
        nodes {
          ${ORDER_SUMMARY_FIELDS}
          lineItems { nodes { quantity } }
        }
      }
    }
  }
`;

const GET_DOWNLOADS_PAGE = `
  query GetDownloadsPage {
    customer {
      ${CUSTOMER_FIELDS}
      downloadableItems {
        nodes {
          name
          downloadId
          downloadsRemaining
          accessExpires
          url
          product { name slug }
        }
      }
    }
  }
`;

const GET_ORDER_PAGE = `
  query GetOrderPage($id: ID!) {
    customer { ${CUSTOMER_FIELDS} }
    order(id: $id, idType: DATABASE_ID) {
      ${ORDER_SUMMARY_FIELDS}
      subtotal
      shippingTotal
      discountTotal
      totalTax
      paymentMethodTitle
      customerNote
      billing { ${ADDRESS_FIELDS} email phone }
      shipping { ${ADDRESS_FIELDS} }
      lineItems {
        nodes {
          productId
          variationId
          quantity
          total
          product { node { name slug image { sourceUrl altText } } }
        }
      }
    }
  }
`;

// WooGraphQL answers "guest" instead of null when the token is not accepted
function realCustomer(customer: GQLCustomer | null): GQLCustomer | null {
  return !customer || customer.id === "guest" ? null : customer;
}

export async function getOrdersPage(
  authToken: string,
  first = 20
): Promise<{ customer: GQLCustomer | null; orders: GQLOrderSummary[] }> {
  const data = await gql<{
    customer: (GQLCustomer & { orders: { nodes: GQLOrderSummary[] } }) | null;
  }>(GET_ORDERS_PAGE, { first }, { authToken });

  return {
    customer: realCustomer(data.customer),
    orders: data.customer?.orders.nodes ?? [],
  };
}

export async function getDownloadsPage(
  authToken: string
): Promise<{ customer: GQLCustomer | null; downloads: DownloadableItem[] }> {
  const data = await gql<{
    customer:
      | (GQLCustomer & { downloadableItems: { nodes: DownloadableItem[] } | null })
      | null;
  }>(GET_DOWNLOADS_PAGE, {}, { authToken });

  return {
    customer: realCustomer(data.customer),
    downloads: data.customer?.downloadableItems?.nodes ?? [],
  };
}

export async function getOrderPage(
  authToken: string,
  databaseId: number
): Promise<{ customer: GQLCustomer | null; order: GQLOrderDetail | null }> {
  const data = await gql<{
    customer: GQLCustomer | null;
    order: GQLOrderDetail | null;
  }>(GET_ORDER_PAGE, { id: String(databaseId) }, { authToken });

  return { customer: realCustomer(data.customer), order: data.order };
}
