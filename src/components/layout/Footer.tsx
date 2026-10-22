// src/components/layout/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import type { FooterData } from "@/types/layout";

// Screen readers need a name for icon-only links — the image alt, else the site's domain
function socialLabel(alt: string | undefined, url: string): string {
  if (alt) return alt;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-dark-alt text-white">
      <div className="md:px-10 md:py-[60px] max-md:px-[20px] max-md:py-[60px]">
        <div className="border-b border-white/10 md:px-[10px] md:pt-[30px] md:pb-10">
          {(data.headingNormal || data.headingBlue) && (
            <h2 className="font-display text-[32px] font-bold leading-none tracking-[-0.3px] md:text-[clamp(36px,5vw,64px)] md:tracking-[-1.92px]">
              {data.headingNormal}  <span className="text-blue sm:inline block">{data.headingBlue}</span>
            </h2>
          )}

          <hr className="my-10 border-white/10" />

          {data.logo && (
            <Image
              src={data.logo.src}
              alt={data.logo.alt || "Elixser Peptides"}
              width={360}
              height={75}
              className="w-[150px] md:w-[360px] h-[auto] md:h-[75px]"
            />
          )}

          {data.description && (
            <p className="mt-[25px] mb-[25px] md:max-w-[75%] font-sans text-[16px] leading-[1.6] text-muted">
              {data.description}
            </p>
          )}

          <div className="flex flex-wrap gap-5 p-[10px]">
            {data.trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-[5px] rounded-md border border-white/33 bg-white/[0.04] px-[15px] py-[10px] font-mono text-[11px] font-medium tracking-[1.6px] text-white uppercase transition-colors hover:border-blue hover:text-blue"
              >
                {/* SVG from the ACF textarea — it strokes with currentColor, so it turns blue here */}
                <span
                  aria-hidden="true"
                  className="text-blue [&_svg]:block [&_svg]:size-3"
                  dangerouslySetInnerHTML={{ __html: badge.iconSvg }}
                />
                {badge.text}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-white/10 md:px-[10px] md:pt-[30px] md:pb-[10px] pt-[20px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {data.columns.map((col, i) => (
              <div key={i} className="p-[10px]">
                <h3 className="mb-5 font-mono text-[16px] font-semibold tracking-[2.2px] text-muted uppercase">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-[10px]">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target={link.target}
                        className="font-sans text-[16px] font-normal leading-6 transition-colors hover:text-blue"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 md:flex items-center justify-between gap-8 md:p-[10px]">
          <div className="md:max-w-[69%] md:pb-[15px]">
            {data.renameNote && (
              <p className="mb-[14px] font-sans text-[14px] font-semibold leading-[22px] text-muted">
                {data.renameNote}
              </p>
            )}
            {/* Legal text and copyright share one paragraph, a blank line apart, like the live site */}
            <p className="whitespace-pre-line font-sans text-[14px] font-semibold leading-[22px] text-muted">
              {[data.legalText, data.copyright].filter(Boolean).join("\n\n")}
            </p>
          </div>

          <div className="md:mt-10 mt-[30px] flex shrink-0 gap-4">
            {data.socialLinks.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialLabel(item.icon?.alt, item.url)}
                className="transition-opacity hover:opacity-80"
              >
                {item.icon && (
                  <Image src={item.icon.src} alt="" width={33} height={33} unoptimized />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
