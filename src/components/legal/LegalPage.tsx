// src/components/legal/LegalPage.tsx

import ResearchUseOnlyBand from "@/components/common/ResearchUseOnlyBand";
import LegalContent from "@/components/legal/LegalContent";
import LegalHero from "@/components/legal/LegalHero";
import type { ResearchBoxData } from "@/types/home";
import type { LegalHeroContent, LegalLink, LegalSection } from "@/types/legal";

type LegalPageProps = {
  hero: LegalHeroContent;
  sections: LegalSection[];
  footnote?: LegalSection | null;
  closingEyebrow?: string;
  sectionsLabel: string;
  links: LegalLink[];
  activeHref: string;
  research: ResearchBoxData | null;
};

// Privacy, Terms, Shipping and Refund share one live Elementor layout
export default function LegalPage({
  hero,
  sectionsLabel,
  research,
  ...content
}: LegalPageProps) {
  return (
    <>
      {hero.title && <LegalHero {...hero} />}
      <LegalContent ariaLabel={sectionsLabel} {...content} />
      {research && <ResearchUseOnlyBand research={research} variant="legal" />}
    </>
  );
}
