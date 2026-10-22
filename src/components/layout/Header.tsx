// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import CartButton from "@/components/layout/CartButton";
import HeaderSearch from "@/components/layout/search/HeaderSearch";
import HeaderNavLinks from "@/components/layout/HeaderNavLinks";
import { AccountIcon, CloseIcon, HamburgerIcon } from "@/components/layout/HeaderIcons";
import type { HeaderData } from "@/types/layout";
// Route progress bar is turned off — client did not want it. Uncomment both lines to bring it back.
// import RouteProgress from "@/components/ui/RouteProgress";

// Suspense fallback while HeaderNavLinks resolves the current path (only needed on
// routes with an unknown dynamic segment) — same links, no active-page highlight yet
function NavLinksFallback({
  links,
  variant,
}: {
  links: HeaderData["menuLinks"];
  variant: "desktop" | "mobile";
}) {
  const className =
    variant === "desktop"
      ? "px-5 py-[13px] text-[14px] font-semibold hover:text-blue transition-colors whitespace-nowrap text-ink-dark"
      : "py-[10px] px-[20px] text-[14px] font-medium text-center hover:text-blue transition-colors text-ink-dark";

  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} target={link.target} className={className}>
          {link.label}
        </Link>
      ))}
    </>
  );
}

export default function Header({ data }: { data: HeaderData }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-11 h-[60px] bg-white md:h-[68px]">
        {/* Sits on the header edge — the top bar is blue, a blue line would vanish there */}
        {/* <RouteProgress /> */}
        {/* 3-column layout matching live site exactly: logo | nav | actions */}
        <div className="flex h-full items-center justify-between px-5 md:px-10">
          {/* Col 1 — Logo (flex-shrink 0, takes natural width) */}
          <div className="flex min-w-0 flex-1 items-center justify-start gap-2 md:gap-[20px] lg:w-[20%] lg:flex-none">
            {/* Hamburger — mobile only */}
            <button
              className="relative flex lg:hidden items-center justify-center w-[25px] h-[25px] before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] md:w-[35px] md:h-[35px] text-blue max-md:top-[1.5px]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <Link href="/" aria-label="Elixser Peptides home" className="relative max-md:top-px">
              {data.logo && (
                <Image
                  src={data.logo.src}
                  alt={data.logo.alt || "Elixser"}
                  width={200}
                  height={56}
                  priority
                  className="h-auto w-[125px] min-[360px]:w-[150px] md:w-[200px]"
                />
              )}
            </Link>
          </div>

          {/* Col 2 — Nav links (flex-grow, centered) */}
          <nav
            className="hidden lg:flex flex-1 items-center justify-start p-[10px]"
            aria-label="Main navigation"
          >
            <Suspense fallback={<NavLinksFallback links={data.menuLinks} variant="desktop" />}>
              <HeaderNavLinks links={data.menuLinks} variant="desktop" />
            </Suspense>
          </nav>

          {/* Col 3 — Actions (right-aligned) */}
          <div className="flex w-auto min-w-0 shrink-0 items-center justify-end gap-[8px] md:min-w-[160px] md:gap-5 md:pr-[22px] lg:w-[20%]">
            {/* Search button + its pop-up box */}
            <HeaderSearch />

            {/* Account icon — desktop only */}
            <Link
              href="/account"
              className="relative flex items-center justify-center md:w-5 md:h-5 w-[18px] h-[18px] text-ink-dark hover:text-blue transition-colors before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
              aria-label="My account"
            >
              <AccountIcon />
            </Link>

            {/* Cart — always visible */}
            <CartButton />


          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-[#000c]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-full max-w-[347px] bg-white p-[20px]">
            <div className="flex flex-col justify-start gap-[30px]" >
              <button
                className="flex items-center justify-center w-[35px] h-[35px] text-blue"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen && <CloseIcon />}
              </button>
              <Link href="/" aria-label="Elixser Peptides home" className="flex items-center justify-center" >
                {data.logo && (
                  <Image
                    src={data.logo.src}
                    alt={data.logo.alt || "Elixser"}
                    width={230}
                    height={56}
                    priority
                    className="h-auto w-[230px]"
                  />
                )}
              </Link>
            </div>
            <nav
              className="flex flex-col px-6  mt-[35px]"
              aria-label="Mobile navigation"
            >
              <Suspense fallback={<NavLinksFallback links={data.menuLinks} variant="mobile" />}>
                <HeaderNavLinks
                  links={data.menuLinks}
                  variant="mobile"
                  onLinkClick={() => setMobileOpen(false)}
                />
              </Suspense>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
