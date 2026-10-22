// src/components/faq/FaqPageSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Question bar + answer lines vary in width so it reads like text, not a barcode
const ROWS = [
  { question: "w-[55%]", lines: ["w-full", "w-[92%]", "w-[60%]"] },
  { question: "w-[70%]", lines: ["w-full", "w-[85%]"] },
  { question: "w-[45%]", lines: ["w-full", "w-[95%]", "w-[70%]"] },
  { question: "w-[62%]", lines: ["w-full", "w-[80%]"] },
];

// Mirrors the FAQ page: hero band, then the 76% column
export default function FaqPageSkeleton() {
  return (
    <div role="status" aria-label="Loading FAQ">
      <section className="border-y border-hero-border bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 min-[768px]:p-[10px]">
          <Skeleton className="h-11 w-[110px] rounded-full" />
          <Skeleton className="h-[42px] w-[300px] max-w-full rounded-chip min-[768px]:h-[46px] min-[1025px]:h-[73px] min-[1025px]:w-[70%]" />
          <Skeleton className="h-5 w-full max-w-[440px] rounded-chip min-[1025px]:max-w-[59%]" />
        </div>
      </section>
      <section className="bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mx-auto flex w-full flex-col gap-5 border-b border-hero-border p-[10px] pb-[60px] min-[768px]:w-[76%]">
            <Skeleton className="h-7 w-[200px] max-w-full rounded-chip" />
            {ROWS.map(({ question, lines }) => (
              <div key={question} className="contents">
                <Skeleton className={`h-7 ${question} rounded-chip`} />
                <div className="flex flex-col gap-3">
                  {lines.map((width) => (
                    <Skeleton key={width} className={`h-4 ${width} rounded-chip`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
