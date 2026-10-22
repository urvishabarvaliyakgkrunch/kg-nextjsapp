// src/types/verification.ts

// Plain string = default body text; objects cover the other live Elementor styles
export type VerificationBlock =
  | string
  // Heavier black copy (refund steps), the padded postal address, or the grey disclaimer quote
  | { html: string; tone: "strong" | "quote" | "address" }
  // Small bold heading that sits inside a section (privacy sub-topics)
  | { subtitle: string };

export interface VerificationSection {
  title: string;
  // One entry per WP rich-text (WYSIWYG) block; live spaces blocks 20px apart
  blocks: VerificationBlock[];
  // "label" = small mono caption (Last updated); "featured" = near-black title, 25px on mobile
  titleStyle?: "label" | "featured";
}

export interface VerificationLink {
  label: string;
  href: string;
}

// ── Raw ACF shapes from WPGraphQL ───────────────
// Field names match the shared verification ACF group, camelCased by WPGraphQL
export interface GQLVerificationPageFields {
  heroSmallHeading: string | null;
  heroMainTitle: string | null;
  heroDescription: string | null;
  sectionsList: { title: string | null; content: string | null }[] | null;
}

// ── Clean shapes the components use ─────────────
export interface VerificationPageData {
  hero: { eyebrow: string; title: string; description: string };
  sections: VerificationSection[];
}
