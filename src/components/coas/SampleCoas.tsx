// src/components/coas/SampleCoas.tsx

import CoasSectionHeading from "@/components/coas/CoasSectionHeading";
import SampleCoaCard from "@/components/coas/SampleCoaCard";
import type { CoasPageData } from "@/types/coas";

export default function SampleCoas({ data }: { data: CoasPageData["samples"] }) {
  const { items, ...heading } = data;

  return (
    <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
        <CoasSectionHeading {...heading} />

        {/* Cards carry 10px vertical margin, so a 10px row gap reads as the live 30px */}
        <ul className="grid grid-cols-1 gap-x-[30px] gap-y-[10px] px-[10px] pb-[10px] min-[1025px]:grid-cols-2">
          {items.map((item) => (
            <SampleCoaCard key={item.index} {...item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
