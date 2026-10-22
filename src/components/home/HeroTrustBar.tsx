// src/components/home/HeroTrustBar.tsx

import Image from "next/image";
import type { HeroSectionData } from "@/types/home";

export default function HeroTrustBar({ items }: { items: HeroSectionData["trustItems"] }) {
  return (
    <div className="relative z-10 flex h-[92px] shrink-0 items-center justify-between gap-1.5 border-t border-black/5 bg-white/90 px-[clamp(0.375rem,1.5vw,0.75rem)] py-[clamp(0.6rem,2vw,1rem)] backdrop-blur-sm md:gap-6 md:px-[72px] md:py-0">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-1 flex-col items-center gap-[0.3rem] justify-center text-center md:flex-row md:gap-3 md:text-left"
        >
          <div
            className="flex size-[2.625rem] shrink-0 items-center justify-center rounded-full bg-black text-white md:size-[3.375rem]"
            aria-hidden="true"
          >
            {item.icon && (
              // Icons are small SVG uploads — skip the optimizer, it does not resize SVG
              <Image
                src={item.icon.src}
                alt=""
                width={40}
                height={40}
                unoptimized
                className="size-[30px] md:size-[40px]"
              />
            )}
          </div>
          {/* Textarea line breaks in WordPress become line breaks here */}
          <span className="whitespace-pre-line font-mono text-[clamp(0.625rem,2.8vw,0.75rem)] font-semibold leading-[1.15] text-ink md:text-[18px] md:font-medium md:leading-[1.2] md:whitespace-pre">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}
