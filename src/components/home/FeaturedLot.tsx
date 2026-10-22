// src/components/home/FeaturedLot.tsx
"use client";

import Image from "next/image";
import LazyVideo from "./LazyVideo";
import { useCountUp } from "@/hooks/useCountUp";
import type { FeaturedLotSectionData } from "@/types/home";

export default function FeaturedLot({ data }: { data: FeaturedLotSectionData }) {
  const { ref, value } = useCountUp<HTMLSpanElement>(data.purity);

  if (!data.productTitle) return null;

  return (
    <section
      aria-label="Featured Lot"
      className="relative overflow-hidden pt-[30px] pb-0 md:pt-[60px] md:pb-[60px]"
    >
      {data.backgroundImage && (
        <Image
          src={data.backgroundImage.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
      )}

      <div className="relative mx-auto w-full max-w-[1300px] px-0">
        <div className="flex flex-col gap-[20px] md:flex-row md:items-stretch md:gap-0">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-col gap-5 px-5">
              {data.smallHeading && (
                <p className="font-mono text-[11px] font-medium leading-[18px] tracking-[2.2px] text-blue uppercase max-md:mt-2">
                  {data.smallHeading}
                </p>
              )}

              <div>
                <h2 className="mt-0 font-display text-[32px] font-bold leading-[1.2] tracking-[-0.3px] text-ink-dark md:text-[35px] md:leading-[1.3] min-[1025px]:text-[56px] min-[1025px]:leading-[56px] min-[1025px]:tracking-[-1.68px]">
                  {data.productTitle}
                </h2>
                {data.purity > 0 && (
                  <span
                    ref={ref}
                    className="inline-flex items-baseline font-display text-[56px] font-bold leading-[56px] text-blue max-md:mt-[3px] max-md:flex max-md:font-sans max-md:text-[35px] max-md:font-semibold max-md:leading-[35px]"
                  >
                    <span>{value}</span>
                    <span>%</span>
                  </span>
                )}
              </div>

              {data.description && (
                <p className="mt-1 w-full whitespace-pre-line font-sans text-[17px] font-normal leading-[27.5px] text-lot-body max-md:mt-0 max-md:mb-[14.4px] min-[1025px]:max-w-[80%]">
                  {data.description}
                </p>
              )}

              {data.specs.length > 0 && (
                <div className="px-[7px] pt-[7px] max-md:pb-[2px] md:px-[11px] md:pt-[11px]">
                  <div className="mt-0 overflow-hidden rounded-[12px] border border-r-0 border-lot-border md:mt-[14px]">
                    <div className="grid grid-cols-2">
                      {data.specs.map((spec, i) => {
                        const isLastRow = i >= data.specs.length - 2;
                        return (
                          <div
                            key={i}
                            className={`border-r border-lot-border p-[10px] ${isLastRow ? "" : "border-b"}`}
                          >
                            <p className="mb-[9px] mt-2 font-mono text-[10px] font-normal leading-4 tracking-[2.2px] text-blue uppercase">
                              {spec.label}
                            </p>
                            <p
                              className={`font-mono text-[14px] font-medium leading-[22px] ${spec.isPass ? "text-lot-pass" : "text-ink-dark"}`}
                            >
                              {spec.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {data.videoUrl && (
            <div className="relative min-h-[400px] min-w-0 flex-1 overflow-hidden rounded-[20px] max-md:mx-5">
              <LazyVideo src={data.videoUrl} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
