// src/types/index.ts

// ── Layout ──────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

// ── GraphQL: Product ─────────────────────────────
export interface GQLProductImage {
  sourceUrl: string;
  altText: string;
}

export interface GQLProductCategory {
  id: string;
  databaseId?: number;
  name: string;
  slug: string;
  count?: number;
}

export interface GQLProductVariation {
  databaseId: number;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  attributes?: { nodes: { name: string; value: string }[] };
}

export interface GQLProduct {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  // Polymorphic — present on Simple + Variable
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  // Absent on older queries, so treat undefined as in stock
  stockStatus?: string;
  // Simple products: stock limit and the Quantity Discount plugin's tiers
  stockQuantity?: number | null;
  backorders?: string;
  elxQtyTiers?: string | null;
  image?: GQLProductImage;
  // _kg_base_price drives the struck-through compare price — Woo regularPrice is unused here
  metaData?: { key: string; value: string | null }[];
  productCategories?: { nodes: GQLProductCategory[] };
  // Variable-only
  variations?: { nodes: GQLProductVariation[] };
}

export interface ShopPageData {
  products: { nodes: GQLProduct[] };
  productCategories: { nodes: GQLProductCategory[] };
}

// ── Cart ─────────────────────────────────────────
// Cart types live in their own file — re-exported so existing imports keep working
export type {
  CartItem,
  CartTier,
  CartTotals,
  CartTotalsResult,
  CouponLine,
  RejectedCoupon,
  ShippingRate,
  FbtSuggestion,
  FbtVariation,
} from "./cart";

// ── Legacy REST (kept for compatibility) ─────────
export interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  image: { src: string; alt: string };
  categories: { id: number; name: string; slug: string }[];
  variationId?: number;
}
