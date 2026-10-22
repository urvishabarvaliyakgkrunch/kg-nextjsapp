// src/app/not-found.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found. Browse the Elixser Peptides catalog.",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[62vh] items-center border-b border-hero-border bg-white px-5 py-16 min-[768px]:px-10 min-[768px]:py-24">
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-5 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-ruo-border bg-ruo-bg px-[14px] py-[7px] font-mono text-[11px] font-normal uppercase leading-[22.4px] tracking-[0.18em] text-lot-body">
          <span
            className="size-1.5 shrink-0 rounded-full bg-hero-dot shadow-[0_0_0_4px_var(--color-hero-dot-ring)]"
            aria-hidden="true"
          />
          404
        </div>

        <h1 className="font-display text-[40px] font-bold leading-[46px] tracking-[-0.4px] text-ink-dark min-[768px]:text-[64px] min-[768px]:leading-[68px]">
          This page could not be found.
        </h1>

        <p className="max-w-[460px] font-sans text-[16px] font-medium leading-[26px] text-lot-body">
          The link may be out of date, or the page may have moved. The catalog
          is still available.
        </p>

        <div className="mt-3 flex flex-col items-center gap-4">
          <Link
            href="/shop"
            className="inline-flex h-[46px] items-center justify-center bg-blue px-8 font-mono text-[14px] font-medium text-white transition-colors hover:bg-atc-hover rounded-[3px] "
          >
            Shop Catalog
          </Link>
          <Link
            href="/"
            className="font-mono text-[13px] text-lot-body underline-offset-4 transition-colors hover:text-blue hover:underline"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
