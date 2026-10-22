// src/app/shipping-policy/page.tsx

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
  const { hero } = await getLegalPageData("shipping-policy");
  return {
    title: "Shipping Policy",
    description: hero.description || undefined,
    alternates: { canonical: "/shipping-policy" },
  };
}

export default async function ShippingPolicyPage() {
  const [research, { hero, sections, footnote }] = await Promise.all([
    getResearchBox(),
    getLegalPageData("shipping-policy"),
  ]);

  return (
    <LegalPage
      hero={hero}
      sections={sections}
      footnote={footnote}
      sectionsLabel="Shipping Policy"
      research={research}
      links={LEGAL_LINKS}
      activeHref="/shipping-policy"
    />
  );
}
