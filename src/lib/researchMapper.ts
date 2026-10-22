// src/lib/researchMapper.ts
// Turns the raw Research ACF response into section objects, so components never touch null checks.

import { acfText as text, toHref, toLinkButton } from "@/lib/helper";
import type {
  CompoundLiterature,
  GQLResearchPageFields,
  ResearchPageData,
} from "@/types/research";

type GQLCompound = NonNullable<GQLResearchPageFields["literatureCompounds"]>[number];

const SHOP_HREF = "/shop";

const pubmedUrl = (pmid: string) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

function toCompound(row: GQLCompound): CompoundLiterature | null {
  // Title and button link both come from the picked product; non-product picks are empty objects
  const product = row.literatureProduct?.nodes?.find((node) => node.name);
  if (!product?.name) return null;

  return {
    compound: text(product.name),
    productsHref: product.uri ? toHref(product.uri) : SHOP_HREF,
    references: (row.compoundStudiesList ?? [])
      .map((study) => {
        const pmid = text(study.studyPubmedId);
        const url = text(study.studyPubmedUrl);
        return {
          citation: text(study.studyAuthorYear),
          journal: text(study.studyJournal),
          title: text(study.studyTitle),
          pmid,
          // The URL field wins; the ID alone is enough to build the PubMed link
          href: url ? toHref(url) : pmid ? pubmedUrl(pmid) : "",
        };
      })
      .filter((reference) => reference.title),
  };
}

// WP sometimes has two literatureCompounds rows pointing at the same product (e.g. GHK-Cu
// [50mg] editing mistake) — that gave the list a duplicate React key and showed the card
// twice. Folding rows with the same compound name into one keeps every reference and makes
// the key unique regardless of whether the duplicate row in WP ever gets cleaned up.
function mergeDuplicateCompounds(compounds: CompoundLiterature[]): CompoundLiterature[] {
  const byName = new Map<string, CompoundLiterature>();
  for (const compound of compounds) {
    const existing = byName.get(compound.compound);
    if (!existing) {
      byName.set(compound.compound, { ...compound, references: [...compound.references] });
      continue;
    }
    for (const reference of compound.references) {
      const isDuplicate = existing.references.some(
        (r) => r.title === reference.title && r.citation === reference.citation
      );
      if (!isDuplicate) existing.references.push(reference);
    }
  }
  return [...byName.values()];
}

export function toResearchPageData(f: GQLResearchPageFields | null): ResearchPageData {
  // Empty object keeps every section safe to read before the admin fills the page
  const d = f ?? ({} as Partial<GQLResearchPageFields>);

  return {
    hero: {
      smallHeading: text(d.heroSmallHeading),
      title: text(d.heroMainTitle),
      description: text(d.heroDescription),
    },
    articles: {
      smallHeading: text(d.articlesSmallHeading),
      title: text(d.articlesTitle),
      description: text(d.articlesDescription),
      items: (d.articlesList ?? []).map((article) => ({
        category: text(article.articleCategory),
        title: text(article.articleTitle),
        summary: text(article.articleSummary),
        status: text(article.statusLabel),
      })),
      notifyText: text(d.notifyText),
      notifyButton: toLinkButton(d.notifyButton),
    },
    literature: {
      smallHeading: text(d.literatureSmallHeading),
      title: text(d.literatureTitle),
      description: text(d.literatureDescription),
      compounds: mergeDuplicateCompounds(
        (d.literatureCompounds ?? [])
          .map(toCompound)
          .filter((compound): compound is CompoundLiterature => compound !== null)
      ),
    },
  };
}
