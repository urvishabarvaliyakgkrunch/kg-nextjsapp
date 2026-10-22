// src/components/coas/VerifyVial.tsx

import CoasSectionHeading from "@/components/coas/CoasSectionHeading";
import LotSearchForm from "@/components/coas/LotSearchForm";
import type { VerifyVialData } from "@/types/coas";

export default function VerifyVial({ data }: { data: VerifyVialData }) {
  const { helpText, helpEmail, ...heading } = data;

  return (
    <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
      {/* Live keeps this and Sample COAs in one container: 20px gap + 10px column padding below */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 pb-[30px] pt-5 min-[768px]:pt-10 min-[1025px]:pt-[60px]">
        <CoasSectionHeading {...heading} />

        <div className="mx-auto flex w-full max-w-[590px] flex-col gap-5 px-[10px] min-[768px]:px-0">
          <LotSearchForm />
          {(helpText || helpEmail) && (
            <p className="text-center font-mono text-[14px] font-medium leading-[18px] text-muted-2">
              {helpText}{" "}
              {helpEmail && (
                <a href={`mailto:${helpEmail}`} className="text-mail-link">
                  {helpEmail}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
