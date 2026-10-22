// src/components/common/VerificationPage.tsx

import PageHero from "@/components/common/PageHero";
import ResearchUseOnlyBand from "@/components/common/ResearchUseOnlyBand";
import VerificationContent from "@/components/common/VerificationContent";
import type { VerificationLink, VerificationSection } from "@/types/verification";
import type { ResearchBoxData } from "@/types/home";

type VerificationPageProps = {
  hero: { eyebrow: string; title: string; description: string };
  sections: VerificationSection[];
  sectionsLabel: string;
  activeHref: string;
  research: ResearchBoxData | null;
  links?: VerificationLink[];
};

// Lab Partner, Test Methods, Quality Standards and the policy pages share one live Elementor layout
export default function VerificationPage({
  hero,
  sections,
  sectionsLabel,
  activeHref,
  research,
  links,
}: VerificationPageProps) {
  return (
    <>
      {hero.title && (
      <section className="border-y border-hero-border bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
        <PageHero {...hero} />
      </section>
      )}
      <VerificationContent
        ariaLabel={sectionsLabel}
        sections={sections}
        activeHref={activeHref}
        links={links}
      />
      {research && <ResearchUseOnlyBand research={research} />}
    </>
  );
}
