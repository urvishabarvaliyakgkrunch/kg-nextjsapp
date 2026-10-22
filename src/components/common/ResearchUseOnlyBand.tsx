// src/components/common/ResearchUseOnlyBand.tsx

import ResearchUseOnly from "@/components/common/ResearchUseOnly";
import type { ResearchBoxData } from "@/types/home";

type ResearchUseOnlyBandProps = {
  research: ResearchBoxData;
  variant?: "page" | "legal";
};

// Closing "for research use only" band shared by the inner pages
export default function ResearchUseOnlyBand({ research, variant = "page" }: ResearchUseOnlyBandProps) {
  return (
    <section aria-label="For research use only" className="bg-white py-[50px]">
      {/* Live band is 70% of a 1250px row from tablet up, full-bleed on mobile */}
      <div className="mx-auto w-full min-[768px]:w-[70%] min-[768px]:max-w-[875px]">
        <ResearchUseOnly content={research} variant={variant} />
      </div>
    </section>
  );
}
