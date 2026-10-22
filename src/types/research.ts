// src/types/research.ts

import type { AcfLink } from "./home";

// ── Raw ACF shapes from WPGraphQL ───────────────
// Field names match the "Research Page Field Next" ACF group, camelCased by WPGraphQL
export interface GQLResearchPageFields {
  heroSmallHeading: string | null;
  heroMainTitle: string | null;
  heroDescription: string | null;

  articlesSmallHeading: string | null;
  articlesTitle: string | null;
  articlesDescription: string | null;
  articlesList:
    | {
        articleCategory: string | null;
        articleTitle: string | null;
        articleSummary: string | null;
        statusLabel: string | null;
      }[]
    | null;
  notifyText: string | null;
  notifyButton: AcfLink | null;

  literatureSmallHeading: string | null;
  literatureTitle: string | null;
  literatureDescription: string | null;
  literatureCompounds:
    | {
        // Relationship field — non-product picks come back as empty objects
        literatureProduct: { nodes: { name?: string | null; uri?: string | null }[] } | null;
        compoundStudiesList:
          | {
              studyAuthorYear: string | null;
              studyJournal: string | null;
              studyTitle: string | null;
              studyPubmedId: string | null;
              studyPubmedUrl: string | null;
            }[]
          | null;
      }[]
    | null;
}

// ── Clean shapes the Research components receive ───
export interface ResearchHeading {
  smallHeading: string;
  title: string;
  description: string;
}

export interface ResearchArticle {
  category: string;
  title: string;
  summary: string;
  status: string;
}

export interface LiteratureReference {
  citation: string;
  journal: string;
  title: string;
  pmid: string;
  href: string;
}

export interface CompoundLiterature {
  compound: string;
  productsHref: string;
  references: LiteratureReference[];
}

export interface ResearchPageData {
  hero: ResearchHeading;
  articles: ResearchHeading & {
    items: ResearchArticle[];
    notifyText: string;
    notifyButton: { label: string; href: string; target?: string } | null;
  };
  literature: ResearchHeading & { compounds: CompoundLiterature[] };
}
