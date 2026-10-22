// src/components/legal/LegalLinks.tsx

import Link from "next/link";
import type { LegalLink } from "@/types/legal";

type LegalLinksProps = {
  links: LegalLink[];
  // Pill matching this href renders as the current page
  activeHref: string;
};

// Live wraps pills on mobile; from tablet up they stay on one row and shrink (labels break), except the first
export default function LegalLinks({ links, activeHref }: LegalLinksProps) {
  return (
    <nav
      aria-label="Policy pages"
      className="flex w-full flex-wrap items-start gap-5 self-center p-[10px] min-[768px]:w-[76%] min-[768px]:flex-nowrap"
    >
      {links.map(({ label, href }) => {
        const isActive = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "inline-block min-w-0 first:shrink-0 rounded-[100px] border border-pill-line px-[30px] py-3 text-center font-sans text-[13px] font-medium leading-[24px] transition-colors duration-300 hover:text-blue focus-visible:text-blue",
              isActive ? "bg-black text-white" : "bg-white text-black",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
