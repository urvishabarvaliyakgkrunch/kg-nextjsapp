// src/app/test-methods/page.tsx

import type { Metadata } from "next";
import VerificationPage from "@/components/common/VerificationPage";
import { getResearchBox } from "@/lib/queries/global";
import { getVerificationPageData } from "@/lib/queries/verification";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getVerificationPageData("test-methods");
  return {
    title: "Test Methods",
    description: hero.description || undefined,
    alternates: { canonical: "/test-methods" },
  };
}

export default async function TestMethodsPage() {
  const [research, { hero, sections }] = await Promise.all([
    getResearchBox(),
    getVerificationPageData("test-methods"),
  ]);

  return (
    <VerificationPage
      hero={hero}
      sections={sections}
      sectionsLabel="Analytical test methods"
      research={research}
      activeHref="/test-methods"
    />
  );
}
