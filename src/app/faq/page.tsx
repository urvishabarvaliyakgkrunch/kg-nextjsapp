// src/app/faq/page.tsx

import type { Metadata } from "next";
import ResearchUseOnlyBand from "@/components/common/ResearchUseOnlyBand";
import FaqHero from "@/components/faq/FaqHero";
import FaqList from "@/components/faq/FaqList";
import { getFaqPageData } from "@/lib/queries/faq";
import { getResearchBox } from "@/lib/queries/global";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getFaqPageData();
  return {
    title: "FAQ",
    description: hero.description || undefined,
    alternates: { canonical: "/faq" },
  };
}

export default async function FaqPage() {
  const [research, { hero, blocks }] = await Promise.all([getResearchBox(), getFaqPageData()]);

  return (
    <>
      {hero.title && <FaqHero {...hero} />}
      {blocks.length > 0 && <FaqList blocks={blocks} />}
      {research && <ResearchUseOnlyBand research={research} />}
    </>
  );
}
