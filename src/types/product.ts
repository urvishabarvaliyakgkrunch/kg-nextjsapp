// src/types/product.ts

export interface WPImage {
  sourceUrl: string;
  altText: string;
}

export interface MetaEntry {
  key: string;
  value: string | null;
}

export interface ProductVariation {
  databaseId: number;
  name: string;
  price: string | null;
  regularPrice: string | null;
  stockStatus: string | null;
  attributes: { nodes: { name: string; value: string }[] };
}

export interface RelatedProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string | null;
  image?: WPImage | null;
  metaData: MetaEntry[];
  // Needed so the shop card's quick-add puts a real variation in the cart
  variations?: { nodes: Omit<ProductVariation, "name" | "regularPrice">[] };
}

export interface ProductDetail {
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  image?: WPImage | null;
  galleryImages?: { nodes: WPImage[] };
  productCategories?: { nodes: { name: string; slug: string }[] };
  price?: string | null;
  regularPrice?: string | null; // simple products only
  stockStatus?: string | null; // simple products only
  stockQuantity?: number | null; // simple products only
  backorders?: string | null; // simple products only
  elxQtyTiers?: string | null; // Quantity Discount plugin: "3:10, 6:15" or ""
  metaData: MetaEntry[];
  variations?: { nodes: ProductVariation[] };
  related?: { nodes: RelatedProduct[] };
}

// ── Parsed ACF content ───────────────────────────
export interface SpecRow {
  label: string;
  value: string;
}

export interface ComponentSpec {
  title: string;
  rows: SpecRow[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Reference {
  authors: string;
  journal: string;
  title: string;
  pubmedId: string;
  pubmedUrl: string;
}

export interface CoaRow {
  label: string;
  value: string;
  pass: boolean;
}

export interface ProductMeta {
  lotNumber: string;
  mgPerVial: string;
  blendType: string;
  purityClass: string;
  typeTitle: string;
  basePrice: number;
  compoundProfileTitle: string;
  compoundProfileDescription: string;
  literatureTitle: string;
  literature: string[];
  researchAreas: string[];
  components: ComponentSpec[];
  blendRows: SpecRow[];
  references: Reference[];
  faqs: FaqItem[];
  coaUrl: string;
  coaRows: CoaRow[];
}

// ── Bundle tier (1 / 2 / 3 vial) ─────────────────
export interface BundleTier {
  variationId: number;
  slug: string;
  label: string;
  sub: string;
  qty: number;
  total: number;
  unit: number;
  undiscounted: number;
  savePct: number;
  saved: number;
  inStock: boolean;
}
