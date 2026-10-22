// src/components/common/VerificationPageSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Bar widths vary so it reads like text, not a barcode
const SECTION_LINES = [
  ["w-full", "w-[92%]", "w-[60%]"],
  ["w-full", "w-[85%]"],
  ["w-full", "w-[95%]", "w-[70%]"],
];

const PILL_WIDTHS = ["w-[130px]", "w-[150px]", "w-[135px]", "w-[125px]"];

// Mirrors VerificationPage: hero band, 76% reading column, pill row
export default function VerificationPageSkeleton() {
  return (
    <div role="status" aria-label="Loading page">
      <section className="border-y border-hero-border bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 p-[10px]">
          <Skeleton className="h-[38px] w-[120px] rounded-full" />
          <Skeleton className="h-[42px] w-[260px] max-w-full rounded-chip min-[768px]:h-[54px] min-[1025px]:h-[73px] min-[1025px]:w-[520px]" />
          <Skeleton className="h-5 w-full max-w-[489px] rounded-chip" />
        </div>
      </section>
      <section className="bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
          <div className="flex w-full flex-col gap-[50px] self-center border-b border-hero-border p-[10px] min-[768px]:w-[76%] min-[768px]:gap-[65px]">
            {SECTION_LINES.map((lines, i) => (
              <div key={i} className="flex flex-col gap-5">
                <Skeleton className="h-7 w-[220px] max-w-full rounded-chip" />
                <div className="flex flex-col gap-3">
                  {lines.map((width) => (
                    <Skeleton key={width} className={`h-4 ${width} rounded-chip`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-wrap gap-5 self-center min-[768px]:w-[76%] min-[768px]:p-[10px]">
            {PILL_WIDTHS.map((width) => (
              <Skeleton key={width} className={`h-12 ${width} rounded-[100px]`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
