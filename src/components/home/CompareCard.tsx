// src/components/home/CompareCard.tsx

import Image from "next/image";
import { CheckIcon, CrossIcon } from "@/components/home/CompareIcons";
import type { CompareColumn, DifferentSectionData } from "@/types/home";

const ROW_HEIGHT = "h-[74px] sm:h-[76px] md:h-[86px]";

function BottleImage({ column }: { column: CompareColumn }) {
  if (!column.bottleImage) return null;
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-[5] flex h-[74px] max-w-[52px] -translate-x-1/2 translate-y-[3px] items-end justify-center sm:h-[100px] sm:max-w-[64px] sm:translate-y-1 md:h-[160px] md:max-w-none md:translate-y-1.5">
      <Image
        src={column.bottleImage.src}
        alt={column.bottleImage.alt || column.name}
        width={80}
        height={160}
        className="h-full w-auto object-contain drop-shadow-lg"
      />
    </div>
  );
}

export default function CompareCard({ data }: { data: DifferentSectionData }) {
  const { features, ourBrand, vendor } = data;

  return (
    <div className="shadow-[0_0px_5px_rgb(0_0_0/0.21)] rounded-[10px]">
      <div className=" px-1  mx-auto w-full max-w-[1180px] pt-[5px] pb-[15px] sm:px-1.5 sm:pt-2 sm:pb-5 md:px-[15px] md:py-[30px] lg:px-5">
        <div className="mt-[100px] grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.48fr)_minmax(0,0.48fr)] items-stretch gap-[3px] sm:mt-[115px] sm:grid-cols-[minmax(0,1.08fr)_minmax(0,0.5fr)_minmax(0,0.5fr)] sm:gap-1 md:mt-[130px] md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-2 lg:mt-20 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-3">
          <div className="min-w-0 pt-1.5 sm:pt-[7px] md:pt-3">
            <div className="flex h-[68px] items-center px-[7px] font-sans text-[7.5px] font-extrabold uppercase tracking-[0.7px] text-cmp-label sm:h-[70px] sm:px-[9px] sm:text-[8px] sm:tracking-[1px] md:h-[83px] md:px-5 md:text-base md:tracking-[1.7px] lg:px-[30px]">
              {data.tableLeftLabel}
            </div>

            {features.map((feature, i) => (
              <div
                key={i}
                className={`group relative flex ${ROW_HEIGHT} items-center gap-1.5 border-t border-cmp-rule px-[7px] transition-all duration-300 hover:border-cmp-rule-hover hover:bg-blue-bg hover:pl-[11px] sm:gap-[7px] sm:px-2 sm:hover:pl-[13px] md:gap-3 md:px-5 md:hover:pl-[27px] lg:gap-4 lg:px-[30px] lg:hover:pl-[38px]`}
              >
                <span className="absolute inset-y-0 left-0 w-[3px] scale-y-[0.4] bg-cmp-accent opacity-0 transition duration-300 group-hover:scale-y-100 group-hover:opacity-100" />

                {/* Pasted SVGs carry only shapes — stroke comes from here so hover can recolour them */}
                <span
                  aria-hidden="true"
                  className="flex size-[25px] shrink-0 items-center justify-center rounded-[7px] border border-cmp-icon-line bg-cmp-icon-tint text-cmp-icon transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:text-cmp-icon-hover sm:size-[27px] sm:rounded-lg md:size-10 md:rounded-img [&_svg]:size-3 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-width:1.8] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] sm:[&_svg]:size-[13px] md:[&_svg]:size-[18px]"
                  dangerouslySetInnerHTML={{ __html: feature.iconSvg }}
                />

                <span className="min-w-0 font-sans text-[10px] font-semibold leading-[1.25] text-cmp-text transition-colors duration-300 group-hover:text-cmp-text-hover sm:text-[10.5px] md:text-sm md:leading-[1.35] lg:text-[15px]">
                  {feature.name}
                </span>
              </div>
            ))}
          </div>

          {/* ── Our brand ── */}
          <div className="group relative min-w-0 text-center transition-transform duration-300 hover:-translate-y-1">
            <BottleImage column={ourBrand} />

            <div className="relative z-[2] overflow-hidden rounded-xl border border-cmp-brand-line bg-linear-to-b from-cmp-brand-tint to-white to-40% shadow-[0_16px_40px_rgb(39_119_211/0.14)] transition duration-300 group-hover:shadow-[0_25px_60px_rgb(35_119_211/0.23)] sm:rounded-[14px] md:rounded-[20px]">
              <span className="absolute top-0 left-[6%] z-[3] h-[3px] w-[88%] bg-cmp-accent" />

              <div className="flex h-[68px] flex-col items-center justify-center border-b border-cmp-rule px-[2px] py-[3px] sm:h-[70px] sm:px-[3px] sm:py-1 md:h-[94px] md:p-2 bg-white/50">
                {ourBrand.badge && (
                  <span className="mb-[3px] inline-flex min-h-[15px] items-center rounded-pill bg-linear-to-br from-cmp-brand to-cmp-accent px-[5px] font-sans text-[5px] font-extrabold uppercase tracking-[0.5px] text-white transition duration-300 group-hover:-translate-y-px sm:mb-1 sm:min-h-4 sm:px-1.5 sm:text-[5.5px] md:mb-[7px] md:min-h-[23px] md:px-3 md:text-[9px] md:tracking-[1.2px]">
                    {ourBrand.badge}
                  </span>
                )}
                <div className="font-sans text-[14px] font-extrabold leading-[1.1] tracking-[-0.2px] text-cmp-brand sm:text-[15px] md:text-[22px]">
                  {ourBrand.name}
                </div>
                <small className="mt-0.5 font-sans text-[6px] font-medium leading-[1.2] sm:text-[6.5px] md:mt-1 md:text-[10px] text-cmp-sub">
                  {ourBrand.subtext}
                </small>
              </div>

              {features.map((_, i) => (
                <div
                  key={i}
                  className={`group/check flex ${ROW_HEIGHT} items-center justify-center border-b border-cmp-rule last:border-b-0 transition-colors duration-300 hover:border-b-[rgba(56,139,218,0.2)] hover:bg-linear-to-b hover:from-white/12 hover:to-white/65`}
                >
                  <span className="flex size-[26px] items-center justify-center rounded-full border border-cmp-check-line bg-cmp-check-tint text-success transition-all duration-300 group-hover/check:scale-[1.14] group-hover/check:-translate-y-px group-hover/check:border-[#5dcb91] group-hover/check:bg-[linear-gradient(145deg,#f3fff8,#c9f4dc)] group-hover/check:shadow-[0_8px_24px_rgba(28,164,99,0.23),0_0_0_4px_rgba(57,190,122,0.08)] sm:size-[27px] md:size-10">
                    <CheckIcon className="size-3 sm:size-[13px] md:size-[19px]" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Typical vendor ── */}
          <div className="group relative min-w-0 text-center transition-transform duration-300 hover:-translate-y-1">
            <BottleImage column={vendor} />

            <div className="relative overflow-hidden rounded-xl border border-danger bg-linear-to-b from-white to-blue-bg to-95% transition duration-300 group-hover:shadow-[0_20px_45px_rgb(65_90_120/0.15)] sm:rounded-[14px] md:rounded-[20px]">
              <div className="flex h-[68px] flex-col items-center justify-center border-b border-cmp-rule px-[2px] py-[3px] sm:h-[70px] sm:px-[3px] sm:py-1 md:h-[94px] md:p-2">
                <div className="max-w-[65px] font-sans text-[8px] font-bold leading-[1.15] text-cmp-vendor sm:max-w-[70px] sm:text-[8.5px] md:max-w-none md:text-sm md:leading-[1.25]">
                  {vendor.name}
                </div>
                <small className="mt-0.5 font-sans text-[6px] font-medium leading-[1.2] sm:text-[6.5px] md:mt-1 md:text-[10px] text-muted">
                  {vendor.subtext}
                </small>
              </div>

              {features.map((_, i) => (
                <div
                  key={i}
                  className={`group/cross flex ${ROW_HEIGHT} items-center justify-center border-b border-cmp-rule last:border-b-0`}
                >
                  <span className="flex size-[26px] items-center justify-center rounded-full transition duration-300 sm:size-[27px] md:size-10 border border-cmp-cross-line bg-cmp-cross-tint text-cmp-cross group-hover/cross:scale-[1.14] group-hover/cross:-translate-y-px group-hover/cross:bg-[linear-gradient(145deg,#fff5f5,#f5cccc)] group-hover/cross:border-[#b85c5c] group-hover/cross:shadow-[0_8px_24px_rgba(131,16,16,0.20),0_0_0_4px_rgba(131,16,16,0.07)]">
                    <CrossIcon className="size-[11px] sm:size-3 md:size-[18px]" />
                  </span>
                </div>
              ))}
         
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
