// src/components/coas/HowWeVerify.tsx

import type { HowWeVerifyData } from "@/types/coas";

const TABLET_COLS = 3;

// Dividers follow the live grid: stacked rows on mobile, 3-col on tablet, one row on desktop
function stepBorders(i: number, total: number) {
  const isLast = i === total - 1;
  const tabletLastRowStart = Math.floor((total - 1) / TABLET_COLS) * TABLET_COLS;
  return [
    isLast ? "" : "border-b",
    i < tabletLastRowStart ? "min-[768px]:border-b" : "min-[768px]:border-b-0",
    i % TABLET_COLS !== TABLET_COLS - 1 && !isLast ? "min-[768px]:border-r" : "",
    "min-[1025px]:border-b-0",
    isLast ? "" : "min-[1025px]:border-r",
  ].join(" ");
}

export default function HowWeVerify({ data }: { data: HowWeVerifyData }) {
  const { steps } = data;

  return (
    <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-5 min-[768px]:py-10 min-[1025px]:py-[60px]">
        <div className="flex items-center justify-center gap-5 p-[10px]">
          <div className="max-w-full text-center min-[1025px]:max-w-[779px]">
            <p className="mb-4 mt-2 font-mono text-[11px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue">
              —{data.smallHeading}
            </p>
            <h2 className="font-display text-[25px] font-bold leading-[32.5px] tracking-[-0.3px] text-ink-dark min-[768px]:text-[45px] min-[768px]:leading-[58.5px] min-[768px]:tracking-[-1.68px] min-[1025px]:text-[56px] min-[1025px]:leading-[59px]">
              {data.title}
            </h2>
          </div>
        </div>

        <ol className="grid grid-cols-1 overflow-hidden rounded-[12px] border border-hero-border min-[768px]:grid-cols-3 min-[768px]:px-[10px] min-[1025px]:grid-cols-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`flex flex-col gap-5 border-hero-border p-[15px] ${stepBorders(i, steps.length)}`}
            >
              <div>
                <p className="mb-4 mt-2 font-mono text-[16px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue min-[768px]:text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-[25px] font-bold leading-[32.5px] text-ink-dark min-[768px]:text-[16px] min-[768px]:leading-[20.8px] min-[1025px]:text-[18px] min-[1025px]:leading-[29px]">
                  {step.title}
                </h3>
              </div>
              <p className="mb-[14.4px] font-sans text-[13px] font-normal leading-5 text-lot-body">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        {/* Mobile: icon wraps above the text, like the live pill */}
        {data.labPartnerHtml && (
          <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-[3px] rounded-full border border-ruo-border bg-verify-pill-bg p-[15px] min-[768px]:w-fit min-[768px]:max-w-full min-[768px]:flex-nowrap min-[768px]:gap-[5px] min-[768px]:p-0 min-[1025px]:gap-5 min-[1025px]:px-5 min-[1025px]:py-[3px]">
            {/* 36px box matches the live icon wrapper height */}
            <span className="shrink-0" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none" className="size-[30px]">
                <rect width="32" height="32" rx="16" fill="var(--color-verify-pill-bg)" />
                <path
                  d="M16 9.33337L10.6666 12V16C10.6666 19.3334 13 22.3334 16 22.6667C19 22.3334 21.3333 19.3334 21.3333 16V12L16 9.33337Z"
                  stroke="var(--color-ink-dark)"
                  strokeWidth="1.06667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 16L15.3333 17.3333L18 14.6666"
                  stroke="var(--color-ink-dark)"
                  strokeWidth="1.06667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {/* WYSIWYG HTML — whatever is bolded in the editor (the lab name) turns black */}
            <div
              className="w-full text-center font-mono text-[12px] font-medium leading-[14.4px] text-verify-pill-text min-[768px]:w-auto min-[768px]:text-left min-[768px]:leading-[19px] [&_strong]:font-bold [&_strong]:text-black"
              dangerouslySetInnerHTML={{ __html: data.labPartnerHtml }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
