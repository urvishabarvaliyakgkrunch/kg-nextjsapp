// src/components/home/Journal.tsx

import type { SectionHeading } from "@/types/home";

export default function Journal({ data }: { data: SectionHeading }) {
  if (!data.mainHeading) return null;

  return (
    <section aria-label="The Journal" className="bg-[#FAFAF9] px-[10px]">
      {/* Same boxed container as QualityFramework / COA: 1300px */}
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-5 px-[10px] py-[30px] min-[1025px]:py-[60px]">
        <div className="w-full py-[10px] min-[768px]:max-w-[596px] min-[1025px]:max-w-[64.934%]">
          {data.smallHeading && (
            <p className="mt-2 mb-4 font-mono text-[11px] font-medium leading-[18px] tracking-[2.2px] text-blue uppercase">
              {data.smallHeading}
            </p>
          )}
          <h2 className="font-display text-[32px] font-bold leading-[1.25] tracking-[-1.2px] text-ink-dark min-[768px]:text-[45px] min-[768px]:leading-[1.3] min-[768px]:tracking-[-1.68px] min-[1025px]:text-[56px] min-[1025px]:leading-[58px]">
            {data.mainHeading}
          </h2>
        </div>
      </div>
    </section>
  );
}
