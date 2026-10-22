// src/app/quality-standards/page.tsx

import type { Metadata } from "next";
import VerificationPage from "@/components/common/VerificationPage";
import { getResearchBox } from "@/lib/queries/global";
import { getVerificationPageData } from "@/lib/queries/verification";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getVerificationPageData("quality-standards");
  return {
    title: "Quality Standards",
    description: hero.description || undefined,
    alternates: { canonical: "/quality-standards" },
  };
}

export default async function QualityStandardsPage() {
  const [research, { hero, sections }] = await Promise.all([
    getResearchBox(),
    getVerificationPageData("quality-standards"),
  ]);

  return (
    <VerificationPage
      hero={hero}
      sections={sections}
      sectionsLabel="Our standards"
      research={research}
      activeHref="/quality-standards"
    />
  );
}
