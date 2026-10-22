// src/app/lab-partner/page.tsx

import type { Metadata } from "next";
import VerificationPage from "@/components/common/VerificationPage";
import { getResearchBox } from "@/lib/queries/global";
import { getVerificationPageData } from "@/lib/queries/verification";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getVerificationPageData("lab-partner");
  return {
    title: "Lab Partner",
    description: hero.description || undefined,
    alternates: { canonical: "/lab-partner" },
  };
}

export default async function LabPartnerPage() {
  const [research, { hero, sections }] = await Promise.all([
    getResearchBox(),
    getVerificationPageData("lab-partner"),
  ]);

  return (
    <VerificationPage
      hero={hero}
      sections={sections}
      sectionsLabel="Independent verification"
      research={research}
      activeHref="/lab-partner"
    />
  );
}
