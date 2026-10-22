// src/lib/verificationMapper.ts
// Turns a verification page's ACF response into hero + sections. Nothing is hardcoded:
// empty fields stay empty until the admin fills them in WordPress.

import { acfHtml, acfText as text } from "@/lib/helper";
import type { GQLVerificationPageFields, VerificationPageData } from "@/types/verification";

export function toVerificationPageData(f: GQLVerificationPageFields | null): VerificationPageData {
  const sections = (f?.sectionsList ?? [])
    .map((s) => ({ title: text(s.title), html: acfHtml(s.content) }))
    .filter((s) => s.title && s.html)
    .map((s) => ({ title: s.title, blocks: [s.html] }));

  return {
    hero: {
      eyebrow: text(f?.heroSmallHeading),
      title: text(f?.heroMainTitle),
      description: text(f?.heroDescription),
    },
    sections,
  };
}
