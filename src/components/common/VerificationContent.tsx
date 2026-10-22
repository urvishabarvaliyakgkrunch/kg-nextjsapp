// src/components/common/VerificationContent.tsx

import VerificationBlockView from "@/components/common/VerificationBlockView";
import VerificationLinks from "@/components/common/VerificationLinks";
import type { VerificationLink, VerificationSection } from "@/types/verification";

// Live legal pages mix three title looks: plain, near-black "featured", and a small mono caption
const TITLE_CLASS = {
  default: "font-display text-[22px] font-bold leading-[28px] text-black",
  featured:
    "font-display text-[25px] font-bold leading-[30px] text-ink-dark min-[768px]:text-[22px] min-[768px]:leading-[28px]",
  label: "mb-[31px] font-mono text-[11px] font-semibold leading-[18px] text-muted",
};

type VerificationContentProps = {
  ariaLabel: string;
  sections: VerificationSection[];
  // Pill matching this href renders as the current page
  activeHref: string;
  links?: VerificationLink[];
};

export default function VerificationContent({
  ariaLabel,
  sections,
  activeHref,
  links,
}: VerificationContentProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
        {/* Live gap = 20px + spacer (10px mobile / 25px tablet+) + 20px */}
        <div className="flex w-full flex-col gap-[50px] self-center border-b border-hero-border p-[10px] text-center min-[768px]:w-[76%] min-[768px]:gap-[65px] min-[768px]:text-left">
          {sections.map(({ title, blocks, titleStyle }) => (
            <div key={title} className="flex flex-col gap-5">
              <h2 className={TITLE_CLASS[titleStyle ?? "default"]}>{title}</h2>
              {blocks.map((block, i) => (
                <VerificationBlockView key={i} block={block} />
              ))}
            </div>
          ))}
        </div>

        <VerificationLinks activeHref={activeHref} links={links} />
      </div>
    </section>
  );
}
