// src/components/legal/LegalPageSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Bar widths vary so it reads like text, not a barcode
const SECTION_LINES = [
  ["w-full", "w-[92%]", "w-[60%]"],
  ["w-full", "w-[85%]"],
  ["w-full", "w-[95%]", "w-[70%]"],
];

const PILL_WIDTHS = ["w-[149px]", "w-[168px]", "w-[158px]", "w-[147px]"];

// Mirrors LegalPage: hero band, 76% reading column, pill row
export default function LegalPageSkeleton() {
  return (
    <div role="status" aria-label="Loading page">
      <section className="border-y border-hero-border bg-white py-[30px] min-[768px]:py-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 px-5 min-[768px]:p-[10px]">
          <Skeleton className="m-[5px] h-[38px] w-[100px] rounded-full" />
          <Skeleton className="h-[42px] w-[260px] max-w-full rounded-chip min-[768px]:h-[46px] min-[1025px]:h-[73px] min-[1025px]:w-[520px]" />
          <Skeleton className="h-[42px] w-full max-w-[339px] rounded-chip min-[768px]:h-[26px] min-[768px]:max-w-[59%]" />
        </div>
      </section>
      <section className="bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
          <div className="flex w-full flex-col gap-[65px] self-center border-b border-hero-border p-[10px] min-[768px]:w-[76%]">
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
          <div className="flex w-full flex-wrap gap-5 self-center p-[10px] min-[768px]:w-[76%]">
            {PILL_WIDTHS.map((width) => (
              <Skeleton key={width} className={`h-[50px] ${width} rounded-[100px]`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
