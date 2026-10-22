// src/components/home/Hero.tsx

import { getImageProps } from "next/image";
import Link from "next/link";
import HeroTrustBar from "@/components/home/HeroTrustBar";
import type { HeroSectionData } from "@/types/home";

// Live design puts a dotted underline under the last word of line 2 ("Purity"), not the full stop
function UnderlinedLastWord({ line }: { line: string }) {
  const match = line.match(/^(.*\s)?(\S+?)([.!?]?)$/);
  if (!match) return <>{line}</>;
  const [, before = "", word, stop] = match;
  return (
    <>
      {before}
      <span className="relative inline-block after:absolute after:bottom-[0.1em] after:left-0 after:w-full after:border-b-2 after:border-dotted after:border-current">
        {word}
      </span>
      {stop}
    </>
  );
}

export default function Hero({ data }: { data: HeroSectionData }) {
  if (!data.titleLine1) return null;

  const imageOpts = { fill: true, priority: true, sizes: "100vw" } as const;
  const desktop = data.desktopImage
    ? getImageProps({ ...imageOpts, src: data.desktopImage.src, alt: data.desktopImage.alt })
    : null;
  const mobile = data.mobileImage
    ? getImageProps({ ...imageOpts, src: data.mobileImage.src, alt: data.mobileImage.alt })
    : null;

  const ratingLabel = [data.ratingText, data.reviewCountText].filter(Boolean).join(", ");

  return (
    <section aria-label="Hero" className="flex h-[600px] flex-col overflow-hidden bg-white md:h-[92vh]">
      <div className="relative min-h-0 flex-1">
        {/* <picture> makes the browser download only the image for the current viewport;
            two priority <Image>s would preload both desktop and mobile files. */}
        {desktop && (
          <picture>
            {mobile && <source media="(max-width: 767px)" srcSet={mobile.props.src} sizes="100vw" />}
            <img
              {...desktop.props}
              alt={data.desktopImage?.alt ?? ""}
              className="absolute inset-0 size-full object-cover object-right max-md:object-[center_bottom]"
            />
          </picture>
        )}

        <div className="absolute top-0 left-0 z-10 flex w-full flex-col items-start justify-start px-[18px] pt-[22px] pb-[20px] md:inset-y-0 md:top-auto md:h-full md:w-[44%] md:max-w-[36rem] md:justify-center md:px-[72px] md:pt-0 md:pb-[28px]">
          {ratingLabel && (
            <div
              className="mb-3.5 inline-flex w-fit items-center gap-[7px] rounded-full border border-black/10 bg-white px-[8px] py-[5px] md:px-[15px] md:py-[7px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              role="img"
              aria-label={ratingLabel}
            >
              <span
                className="shrink-0 md:text-[13px] text-[10px] leading-none tracking-[0.04em] text-star"
                aria-hidden="true"
              >
                ★★★★★
              </span>
              <span className="whitespace-nowrap font-mono text-[8px] md:text-[10px] font-semibold uppercase leading-none tracking-[0.06em] text-ink">
                {data.ratingText}
              </span>
              {data.reviewCountText && (
                <>
                  <span className="size-1.5 shrink-0 rounded-full bg-blue-alt" aria-hidden="true" />
                  <span className="whitespace-nowrap font-mono text-[8px] md:text-[10px] font-semibold uppercase leading-none tracking-[0.06em] text-ink">
                    {data.reviewCountText}
                  </span>
                </>
              )}
            </div>
          )}

          <h1 className="mb-[20px] mt-[8px] font-display text-[40px] font-bold leading-[1.05] tracking-[-0.035em] text-ink md:text-[62px] md:tracking-[-0.05em]">
            <span className="block md:whitespace-nowrap">{data.titleLine1}</span>
            {data.titleLine2 && (
              <span className="mt-[0.3rem] block md:whitespace-nowrap">
                <UnderlinedLastWord line={data.titleLine2} />
              </span>
            )}
            {data.titleLine3 && (
              <span className="mt-[0.3rem] block text-muted-alt md:whitespace-nowrap">
                {data.titleLine3}
              </span>
            )}
          </h1>

          {data.subtitle && (
            <p className="mb-[clamp(0.75rem,2.5vw,1.125rem)] font-sans text-[15px] leading-[1.45] text-ink md:mb-8 md:text-[19px]">
              {data.subtitle}
            </p>
          )}

          {data.button && (
            <Link
              href={data.button.href}
              target={data.button.target}
              className="inline-flex shrink-0 items-center justify-center rounded-pill leading-[normal] md:leading-[20px] border-2 border-black bg-black md:px-[30px] md:py-[13px] px-[24px] py-[11px] font-sans text-[14px] md:text-[16px] font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-black hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] md:px-[38px] md:py-[16px] md:text-base"
            >
              {data.button.label}
            </Link>
          )}
        </div>
      </div>

      {data.trustItems.length > 0 && <HeroTrustBar items={data.trustItems} />}
    </section>
  );
}
