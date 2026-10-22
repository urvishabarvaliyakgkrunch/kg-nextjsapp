// src/components/coas/CoasSectionHeading.tsx

import type { CoasHeading } from "@/types/coas";

export default function CoasSectionHeading({ smallHeading, title, description }: CoasHeading) {
  return (
    <div className="flex items-center justify-center p-[10px]">
      <div className="flex max-w-full flex-col items-center text-center min-[1025px]:max-w-[779px]">
        <p className="mb-4 mt-2 font-mono text-[11px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue">
          —{smallHeading}
        </p>
        <h2 className="font-display text-[32px] font-bold leading-[40px] tracking-[-1.2px] text-ink-dark min-[768px]:text-[45px] min-[768px]:leading-[58.5px] min-[768px]:tracking-[-1.68px] min-[1025px]:text-[56px] min-[1025px]:leading-[59px]">
          {title}
        </h2>
        <p className="mb-[14.4px] mt-5 w-full font-sans text-[16px] font-medium leading-[26px] text-muted-2">
          {description}
        </p>
      </div>
    </div>
  );
}
