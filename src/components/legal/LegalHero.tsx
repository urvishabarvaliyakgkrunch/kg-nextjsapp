// src/components/legal/LegalHero.tsx

import LegalEyebrow from "@/components/legal/LegalEyebrow";
import type { LegalHeroContent } from "@/types/legal";

// Live policy hero: column is 0/20px padded on mobile, 10px from tablet up
export default function LegalHero({ eyebrow, title, description }: LegalHeroContent) {
  return (
    <section className="border border-hero-border bg-white py-[30px] min-[768px]:py-[60px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 px-5 min-[768px]:p-[10px]">
        <LegalEyebrow label={eyebrow} />

        <h1 className="w-full max-w-[587px] text-center font-display text-[35px] font-bold leading-[42px] text-ink-dark min-[768px]:leading-[45.5px] min-[1025px]:max-w-[70%] min-[1025px]:text-[72px] min-[1025px]:leading-[73px]">
          {title}
        </h1>

        <p className="w-full max-w-[339px] text-center font-sans text-[16px] font-medium leading-[20.8px] text-muted-2 min-[768px]:max-w-[59%] min-[768px]:leading-[26px]">
          {description}
        </p>
      </div>
    </section>
  );
}
