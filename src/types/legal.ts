// src/types/legal.ts

// Plain string = default grey rich text; "strong" = black refund copy, "quote" = grey disclaimer
export type LegalBlock =
  | string
  | { html: string; tone: "strong" | "quote" }
  // Thin rule under the privacy "Last updated" caption
  | { divider: true };

export interface LegalSection {
  // Empty when the admin leaves a row untitled (e.g. the privacy intro under "Last updated")
  title: string;
  blocks: LegalBlock[];
  // "label" = small mono caption (Last updated); "featured" = near-black title, 25px on mobile
  titleStyle?: "label" | "featured";
}

export interface LegalHeroContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface LegalLink {
  label: string;
  href: string;
}

// Refund copy is heavier black text with featured titles; the other policies use the standard look
export type LegalPageStyle = "standard" | "refund";

// ── Raw ACF shape from WPGraphQL ───────────────
// Field names match the "Legal Page Fields" ACF group, camelCased by WPGraphQL
export interface GQLLegalPageFields {
  heroSmallHeading: string | null;
  heroMainTitle: string | null;
  heroDescription: string | null;
  lastUpdated: string | null;
  disclaimer: string | null;
  sectionsList: { title: string | null; content: string | null }[] | null;
}

// ── Clean shape the components use ─────────────
export interface LegalPageData {
  hero: LegalHeroContent;
  sections: LegalSection[];
  footnote: LegalSection | null;
}
