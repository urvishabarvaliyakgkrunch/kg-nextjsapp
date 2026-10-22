// src/components/ui/PageHero.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_MS = 2000;

function StatCell({
  label,
  value,
  suffix = "",
  prefix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          const eased = 1 - (1 - t) * (1 - t);
          setDisplay(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="flex w-full flex-col items-center justify-center gap-[14px]"
    >
      {/* User/live target: large Inter 600 · ink-dark (not brand blue) */}
      <div className="flex items-baseline justify-center font-display text-[64px] font-bold leading-[64px] text-ink-dark min-[768px]:text-[36px] min-[768px]:leading-[30px]">
        {prefix ? <span>{prefix}</span> : null}
        <span>{display}</span>
        {suffix ? <span>{suffix}</span> : null}
      </div>
      <div className="text-center font-mono text-[11px] font-medium uppercase leading-[17.5px] tracking-[1.32px] text-[#0A0A0A]">
        {label}
      </div>
    </div>
  );
}

/** Shared inner-page hero — matched to live COAs first section + provided reference. */
export default function PageHero({
  eyebrow,
  title,
  description,
  isShopPage = false,
  stats = [],
}: {
  eyebrow?: string;
  title: string;
  description: string;
  isShopPage?: boolean;
  stats?: { label: string; value: number; suffix?: string; prefix?: string }[];
}) {
  return (
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Live: col pad 10 · gap 20 · centered */}
        <div className="flex flex-col items-center gap-5 p-[10px]">
          {/* Live .catalog-eyebrow */}
          {eyebrow && (
          <div className="m-[5px] inline-flex items-center gap-2 rounded-full border border-ruo-border bg-ruo-bg px-[14px] py-[7px] font-mono text-[11px] font-normal uppercase leading-[22.4px] tracking-[0.18em] text-lot-body">
            <span
              className="size-1.5 shrink-0 rounded-full bg-hero-dot shadow-[0_0_0_4px_var(--color-hero-dot-ring)]"
              aria-hidden="true"
            />
            {eyebrow}
          </div>
          )}

          <h1 className="w-full max-w-full text-center font-display text-[35px] font-bold leading-[42px] text-ink-dark min-[768px]:max-w-[587px] min-[768px]:text-[45px] min-[768px]:leading-[54px] min-[1025px]:max-w-[72.287%] min-[1025px]:text-[72px] min-[1025px]:leading-[73px]">
            {title}
          </h1>

          <p className={`w-full max-w-full text-center font-sans text-[16px] font-medium mb-[15px] leading-[20.8px] text-lot-body min-[768px]:max-w-[489px] min-[768px]:leading-[26px]  ${isShopPage ? 'min-[1025px]:max-w-[68%]' : 'min-[1025px]:max-w-[59%]'}`}>
            {description}
          </p>

          {stats.length > 0 ? (
            /* Live stats strip: #FAFAF8 · #EDEDED · r12 · pad 10 · gap 20 · 100% / 450 / 50% */
            <div className="flex w-full flex-col gap-5 rounded-[12px] border border-hero-border bg-hero-surface p-[10px] min-[768px]:w-[450px] min-[768px]:flex-row min-[1025px]:w-1/2">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={[
                    "flex min-w-0 flex-1 items-center justify-center px-[10px] py-[14px] min-[768px]:p-[10px]",
                    i < stats.length - 1
                      ? "border-b border-hero-border min-[768px]:border-b-0 min-[768px]:border-r"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <StatCell {...stat} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
  );
}
