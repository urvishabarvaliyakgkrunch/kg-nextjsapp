// src/components/home/HowDifferent.tsx

import CompareCard from "@/components/home/CompareCard";
import type { DifferentSectionData } from "@/types/home";

export default function HowDifferent({ data }: { data: DifferentSectionData }) {
  if (!data.mainHeading && data.features.length === 0) return null;

  return (
    <section aria-label="How we're different" className="bg-white">
      <div className="container-site">
        <div className="flex flex-col gap-5 md:p-[10px] lg:py-[60px]">
          <div className="px-[10px] lg:max-w-[64%]">
            {data.smallHeading && (
              <p className="mt-2 mb-4 font-mono text-[11px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue">
                {data.smallHeading}
              </p>
            )}
            {data.mainHeading && (
              <h2 className="font-display text-[28px] font-bold leading-[36px] tracking-[-1.2px] text-ink-dark md:text-[45px] md:leading-[58.5px] md:tracking-[-1.68px] lg:text-[56px] lg:leading-[58px]">
                {data.mainHeading}
              </h2>
            )}
          </div>
          <CompareCard data={data} />
        </div>
      </div>
    </section>
  );
}
