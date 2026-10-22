// src/lib/legalMapper.ts
// Turns a policy page's ACF response into hero + sections. Nothing is hardcoded:
// empty fields stay empty until the admin fills them in WordPress.

import { acfHtml, acfText as text } from "@/lib/helper";
import type {
  GQLLegalPageFields,
  LegalBlock,
  LegalPageData,
  LegalPageStyle,
  LegalSection,
} from "@/types/legal";

// Admin starts the disclaimer editor with a heading; that heading becomes the disclaimer title
const LEADING_HEADING = /^\s*<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i;

function toFootnote(value: string | null): LegalSection | null {
  const html = acfHtml(value);
  if (!html) return null;

  const match = html.match(LEADING_HEADING);
  const title = match ? text(match[1]) : "";
  const body = match ? html.slice(match[0].length).trim() : html;
  return { title, titleStyle: "featured", blocks: body ? [{ html: body, tone: "quote" }] : [] };
}

export function toLegalPageData(
  f: GQLLegalPageFields | null,
  style: LegalPageStyle = "standard"
): LegalPageData {
  const isRefund = style === "refund";
  const toBlock = (html: string): LegalBlock => (isRefund ? { html, tone: "strong" } : html);

  const sections: LegalSection[] = (f?.sectionsList ?? [])
    .map((s) => ({ title: text(s.title), html: acfHtml(s.content) }))
    .filter((s) => s.title || s.html)
    .map((s) => ({
      title: s.title,
      blocks: s.html ? [toBlock(s.html)] : [],
      titleStyle: isRefund ? "featured" : undefined,
    }));

  // "Last updated" sits above a thin rule; an untitled first row is the intro text under it
  const lastUpdated = text(f?.lastUpdated);
  if (lastUpdated) {
    const intro = sections[0] && !sections[0].title ? sections.shift() : undefined;
    sections.unshift({
      title: lastUpdated,
      titleStyle: "label",
      blocks: [{ divider: true }, ...(intro?.blocks ?? [])],
    });
  }

  return {
    hero: {
      eyebrow: text(f?.heroSmallHeading),
      title: text(f?.heroMainTitle),
      description: text(f?.heroDescription),
    },
    sections,
    footnote: toFootnote(f?.disclaimer ?? null),
  };
}
