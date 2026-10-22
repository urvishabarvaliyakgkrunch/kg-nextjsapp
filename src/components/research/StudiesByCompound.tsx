// src/components/research/StudiesByCompound.tsx

import ResearchSectionHeading from "@/components/research/ResearchSectionHeading";
import CompoundLiteratureCard from "@/components/research/CompoundLiteratureCard";
import type { ResearchPageData } from "@/types/research";

export default function StudiesByCompound({ data }: { data: ResearchPageData["literature"] }) {
  return (
    <section
      aria-label="Studies by compound"
      className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-[30px] min-[768px]:py-10 min-[1025px]:py-[60px]">
        <ResearchSectionHeading
          eyebrow={data.smallHeading}
          title={data.title}
          description={data.description}
        />

        {data.compounds.map((item) => (
          <CompoundLiteratureCard key={item.compound} {...item} />
        ))}
      </div>
    </section>
  );
}
