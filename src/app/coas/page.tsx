// src/app/coas/page.tsx

import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import VerifyVial from "@/components/coas/VerifyVial";
import SampleCoas from "@/components/coas/SampleCoas";
import HowWeVerify from "@/components/coas/HowWeVerify";
import ResearchUseOnly from "@/components/common/ResearchUseOnly";
import { getCoasPageData } from "@/lib/queries/coas";
import { getResearchBox } from "@/lib/queries/global";

// Shares the page's cached result, so the tags cost no extra WordPress call
export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getCoasPageData();
  return {
    title: "COAs",
    description: hero.description,
    alternates: { canonical: "/coas" },
  };
}

export default async function CoasPage() {
  // Two independent queries side by side — COAs keeps a 24-hour cache, global a 1-week cache
  const [coas, research] = await Promise.all([getCoasPageData(), getResearchBox()]);
  const { hero } = coas;

  return (
    <>
      <section className="border-b border-hero-border bg-white px-[10px] py-[60px]">
        <PageHero
          eyebrow={hero.smallHeading}
          title={hero.title}
          description={hero.description}
          stats={hero.stats}
        />
      </section>
      <HowWeVerify data={coas.howWeVerify} />
      <VerifyVial data={coas.verifyVial} />
      <SampleCoas data={coas.samples} />
      {research && (
        <section
          aria-label="For research use only"
          className="bg-white px-5 pb-5 pt-5 min-[768px]:px-10 min-[768px]:pb-10 min-[1025px]:px-[60px] min-[1025px]:pb-[60px]"
        >
          <ResearchUseOnly content={research} variant="page" />
        </section>
      )}
    </>
  );
}
