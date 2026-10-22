// src/components/home/QualityFramework.tsx

import type { FrameworkSectionData } from "@/types/home";

export default function QualityFramework({ data }: { data: FrameworkSectionData }) {
  if (data.testCards.length === 0) return null;

  return (
    <section aria-label="Quality framework" className="bg-white px-[10px]">
      {/* Live boxed container: 1300px · pad 60/10 desktop · 30/10/0 ≤1024 */}
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-5 px-[10px] pt-[30px] pb-0 min-[1025px]:py-[60px]">
        <div className="w-full py-[10px] min-[768px]:max-w-[596px] min-[1025px]:max-w-[64.934%]">
          {data.smallHeading && (
            <p className="mt-2 mb-4 font-mono text-[11px] font-medium leading-[18px] tracking-[2.2px] text-blue uppercase">
              {data.smallHeading}
            </p>
          )}
          {data.mainHeading && (
            <h2 className="font-display text-[32px] font-bold leading-[1.25] tracking-[-1.2px] text-ink-dark min-[768px]:text-[45px] min-[768px]:leading-[1.3] min-[768px]:tracking-[-1.68px] min-[1025px]:text-[56px] min-[1025px]:leading-[58px]">
              {data.mainHeading}
            </h2>
          )}
        </div>

        {/* Live grid: 1 col ≤767 · 3 col ≤1200 · 5 col desktop · gap 20 */}
        <div className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-3 min-[1201px]:grid-cols-5">
          {data.testCards.map((card, i) => (
            <article
              key={i}
              className="relative flex flex-col gap-[10px] rounded-[8px] border border-[#E5E5E2] bg-white px-5 pt-5 pb-4 min-[768px]:gap-[15px] min-[768px]:pb-5 transition-[border-color,box-shadow] duration-300 hover:border-blue hover:shadow-[0px_0px_10px_2px_rgba(1,101,255,0.1)] min-[768px]:min-h-0"
            >
              {/* SVG markup from the ACF textarea, sized to the live 50px icon */}
              <div
                aria-hidden="true"
                className="h-[44px] [&_svg]:block [&_svg]:h-[44px] [&_svg]:w-[44px] min-[768px]:h-[56px] min-[768px]:[&_svg]:h-[50px] min-[768px]:[&_svg]:w-[50px]"
                dangerouslySetInnerHTML={{ __html: card.iconSvg }}
              />

              {/* Live title block width 59% so the corner pill stays clear */}
              <div className="w-full max-w-[316px] min-[768px]:w-[59%] min-[768px]:max-w-[59%]">
                <p className="mt-0 mb-1 font-mono text-[11px] font-medium leading-[18px] tracking-[2.2px] text-blue uppercase min-[768px]:mt-2 min-[768px]:mb-4">
                  {card.number}
                </p>
                <h3 className="font-display text-[22px] font-bold leading-[1.3] tracking-[-0.48px] text-ink-dark min-[1025px]:text-[24px] min-[1025px]:leading-[38px]">
                  {card.title}
                </h3>
              </div>

              {card.methodBadge && (
                <span className="absolute -top-[13px] right-[10px] rounded-full border border-[#06F] bg-blue px-[10px] py-[3px] font-mono text-[10px] font-medium leading-[16px] tracking-[1.2px] text-white uppercase">
                  {card.methodBadge}
                </span>
              )}

              <p className="-mt-[6px] font-sans text-[15px] leading-[1.5] min-[768px]:-mt-[10px] min-[768px]:text-[16px] min-[768px]:leading-[1.6] font-normal text-lot-body min-[1025px]:text-[14px] min-[1025px]:leading-[1.5]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
