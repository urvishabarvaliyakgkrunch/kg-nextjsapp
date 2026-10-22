// src/components/common/VerificationLinks.tsx

import Link from "next/link";
import { VERIFICATION_LINKS } from "@/lib/verificationLinks";
import type { VerificationLink } from "@/types/verification";

type VerificationLinksProps = {
  activeHref: string;
  links?: VerificationLink[];
};

export default function VerificationLinks({
  activeHref,
  links = VERIFICATION_LINKS,
}: VerificationLinksProps) {
  return (
    <nav
      aria-label="Related pages"
      className="grid w-full grid-cols-2 gap-5 self-center px-[5px] min-[768px]:flex min-[768px]:w-[76%] min-[768px]:flex-wrap min-[768px]:p-[10px]"
    >
      {links.map(({ label, href }, index) => {
        const isActive = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
              `inline-block rounded-[100px] border border-pill-line px-3 py-3 text-center font-sans text-[13px] font-medium leading-[24px] transition-colors duration-300 hover:text-blue focus-visible:text-blue min-[768px]:px-[30px] ${links.length % 2 === 1 && index === links.length - 1 ? "col-span-2 w-fit justify-self-center px-[30px]" : ""}`,
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
