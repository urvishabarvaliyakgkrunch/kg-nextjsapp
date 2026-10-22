// src/components/legal/LegalContent.tsx

import { Fragment } from "react";
import LegalEyebrow from "@/components/legal/LegalEyebrow";
import LegalLinks from "@/components/legal/LegalLinks";
import LegalSectionView from "@/components/legal/LegalSectionView";
import type { LegalLink, LegalSection } from "@/types/legal";

type LegalContentProps = {
  ariaLabel: string;
  sections: LegalSection[];
  // Terms adds a disclaimer after the closing spacer; the other policies end there
  footnote?: LegalSection | null;
  links: LegalLink[];
  activeHref: string;
  // Live privacy page repeats its eyebrow chip under the pills
  closingEyebrow?: string;
};

export default function LegalContent({
  ariaLabel,
  sections,
  footnote,
  links,
  activeHref,
  closingEyebrow,
}: LegalContentProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
        {/* Mirrors live Elementor: 20px gaps with a 25px spacer between sections, 50px at the end */}
        {(sections.length > 0 || footnote) && (
          <div className="flex w-full flex-col gap-5 self-center border-b border-hero-border p-[10px] min-[768px]:w-[76%]">
            {sections.map((section, i) => (
              <Fragment key={i}>
                {i > 0 && <div className="h-[25px]" aria-hidden="true" />}
                <LegalSectionView {...section} />
              </Fragment>
            ))}
            <div className="h-[50px]" aria-hidden="true" />
            {footnote && <LegalSectionView {...footnote} />}
          </div>
        )}

        <LegalLinks links={links} activeHref={activeHref} />

        {closingEyebrow && (
          <div className="flex justify-center p-[10px]">
            <LegalEyebrow label={closingEyebrow} />
          </div>
        )}
      </div>
    </section>
  );
}
