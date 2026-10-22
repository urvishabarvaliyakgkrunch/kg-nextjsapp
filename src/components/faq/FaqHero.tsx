// src/components/faq/FaqHero.tsx

import type { FaqHeroContent } from "@/types/faq";

// FAQ hero differs from PageHero: white dotted pill, 35px title on tablet
export default function FaqHero({ eyebrow, title, description }: FaqHeroContent) {
  return (
    <section className="border-y border-hero-border bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col items-center gap-5 min-[768px]:p-[10px]">
          <div className="flex items-center justify-center gap-[5px] rounded-full border border-ruo-border bg-white p-[10px] font-mono font-bold uppercase tracking-[1.1px] shadow-[0_0_10px_rgba(10,10,10,0.06)] min-[768px]:px-5">
            <span aria-hidden="true" className="text-[40px] leading-[22px] text-blue">
              ·
            </span>
            <span className="text-[15px] leading-[18px] text-ink-dark min-[768px]:text-[14px] min-[768px]:leading-[22px]">
              {eyebrow}
            </span>
          </div>

          <h1 className="w-full text-center font-display text-[35px] font-bold leading-[42px] text-ink-dark min-[768px]:max-w-[587px] min-[768px]:leading-[45.5px] min-[1025px]:w-[70%] min-[1025px]:max-w-none min-[1025px]:text-[72px] min-[1025px]:leading-[73px]">
            {title}
          </h1>

          <p className="w-full text-center font-sans text-[16px] font-medium leading-[20.8px] text-muted-2 min-[768px]:w-[59%] min-[768px]:leading-[26px]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
