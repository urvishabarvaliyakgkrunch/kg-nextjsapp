// src/types/faq.ts

// The live FAQ is one flat list: group headings, question + answer pairs, and one closing note
export type FaqPageBlock =
  | { type: "group"; title: string }
  | { type: "question"; title: string; answer: string }
  | { type: "answer"; answer: string };

export interface FaqHeroContent {
  eyebrow: string;
  title: string;
  description: string;
}

// ── Raw ACF shape from WPGraphQL ───────────────
// Field names match the "FAQ Page Field Next" ACF group, camelCased by WPGraphQL
export interface GQLFaqPageFields {
  heroSmallHeading: string | null;
  heroMainTitle: string | null;
  heroDescription: string | null;
  faqGroups:
    | {
        groupTitle: string | null;
        questions: { question: string | null; answer: string | null }[] | null;
      }[]
    | null;
  closingTitle: string | null;
  closingText: string | null;
}

// ── Clean shape the components use ─────────────
export interface FaqPageData {
  hero: FaqHeroContent;
  blocks: FaqPageBlock[];
}
