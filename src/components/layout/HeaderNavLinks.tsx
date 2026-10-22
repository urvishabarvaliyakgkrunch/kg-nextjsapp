// src/components/layout/HeaderNavLinks.tsx
// Split out of Header so usePathname() (only resolvable at request time on
// routes with an unknown dynamic segment, e.g. /product/[slug]) sits behind
// its own Suspense boundary instead of blocking the whole layout's prerender.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LinkButton } from "@/types/home";

// A link is active on its own page and on anything under it, e.g. /coas/lot-21037
function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

interface Props {
  links: LinkButton[];
  variant: "desktop" | "mobile";
  onLinkClick?: () => void;
}

export default function HeaderNavLinks({ links, variant, onLinkClick }: Props) {
  const pathname = usePathname();

  const className =
    variant === "desktop"
      ? (active: boolean) =>
          `px-5 py-[13px] text-[14px] font-semibold hover:text-blue transition-colors whitespace-nowrap ${
            active ? "text-blue" : "text-ink-dark"
          }`
      : (active: boolean) =>
          `py-[10px] px-[20px] text-[14px] font-medium text-center hover:text-blue transition-colors ${
            active ? "text-blue" : "text-ink-dark"
          }`;

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target={link.target}
          // Only the colour changes, so the menu never shifts on click
          aria-current={isActive(pathname, link.href) ? "page" : undefined}
          className={className(isActive(pathname, link.href))}
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
