// src/app/refund-policy/page.tsx

import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_LINKS } from "@/lib/legalLinks";
import { getResearchBox } from "@/lib/queries/global";
import { getLegalPageData } from "@/lib/queries/legal";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getLegalPageData("refund-policy", "refund");
  return {
    title: "Refund Policy",
    description: hero.description || undefined,
    alternates: { canonical: "/refund-policy" },
  };
}

export default async function RefundPolicyPage() {
  const [research, { hero, sections, footnote }] = await Promise.all([
    getResearchBox(),
    getLegalPageData("refund-policy", "refund"),
  ]);

  return (
    <LegalPage
      hero={hero}
      sections={sections}
      footnote={footnote}
      sectionsLabel="Refund Policy"
      research={research}
      links={LEGAL_LINKS}
      activeHref="/refund-policy"
    />
  );
}
