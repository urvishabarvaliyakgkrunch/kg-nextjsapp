// src/app/page.tsx

import Hero from "@/components/home/Hero";
import Featured from "@/components/home/Featured";
import HowDifferent from "@/components/home/HowDifferent";
import FeaturedLot from "@/components/home/FeaturedLot";
import QualityFramework from "@/components/home/QualityFramework";
import CertificateOfAnalysis from "@/components/home/CertificateOfAnalysis";
import ResearchUseOnly from "@/components/common/ResearchUseOnly";
import { getHomePageData } from "@/lib/queries/home";
import { getResearchBox } from "@/lib/queries/global";
import type { Metadata } from "next";

// Title and description come from the root layout; the home page only needs to name its
// own canonical, so "/" never competes with "/?utm_source=…" in search results.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Two independent queries, fetched side by side — home keeps a 24-hour cache, global a 1-week cache
  const [home, research] = await Promise.all([getHomePageData(), getResearchBox()]);

  return (
    <>
      <Hero data={home.hero} />
      <Featured data={home.featured} />
      <HowDifferent data={home.different} />
      <FeaturedLot data={home.featuredLot} />
      <QualityFramework data={home.framework} />
      <CertificateOfAnalysis data={home.coa} />
      {research && (
        <section
          aria-label="For research use only"
          className="bg-white px-5 pb-[30px] min-[768px]:pb-[60px]"
        >
          <ResearchUseOnly content={research} />
        </section>
      )}
      {/* The Journal has no articles yet — hidden until it does */}
    </>
  );
}
