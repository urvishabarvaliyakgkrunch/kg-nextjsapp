// src/app/research/page.tsx

import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ResearchArticles from "@/components/research/ResearchArticles";
import StudiesByCompound from "@/components/research/StudiesByCompound";
import { getResearchPageData } from "@/lib/queries/research";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// Shares the page's cached result, so the tags cost no extra WordPress call
export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getResearchPageData();
  return {
    title: "Research",
    description: hero.description,
    alternates: { canonical: "/research" },
  };
}

export default async function ResearchPage() {
  const { hero, articles, literature } = await getResearchPageData();

  return (
    <>
      <section className="border-b border-hero-border bg-white px-[10px] pt-[30px] pb-[10px] md:py-[60px]">
        <PageHero eyebrow={hero.smallHeading} title={hero.title} description={hero.description} />
      </section>
      <ResearchArticles data={articles} />
      <StudiesByCompound data={literature} />
    </>
  );
}
