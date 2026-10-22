// src/app/account/error.tsx
"use client";

import PageHero from "@/components/common/PageHero";
import { ACCOUNT_HERO } from "@/lib/accountCopy";

// A slow or sleeping WordPress used to drop the shopper on the login box, which looked
// like a surprise sign-out. They are still signed in — this just asks them to retry.
export default function AccountError({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <PageHero {...ACCOUNT_HERO} />
      <section className="container-site py-10 md:py-[60px]">
        <div className="mx-auto flex w-full max-w-[670px] flex-col items-center gap-5 border-t-[3px] border-danger bg-hero-surface px-6 py-10 text-center">
          <p className="font-mono text-[14px] text-ink">
            We could not reach the store just now. You are still signed in.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-[46px] items-center justify-center bg-blue px-8 font-mono text-[14px] font-medium text-white transition-colors hover:bg-atc-hover"
          >
            Try again
          </button>
        </div>
      </section>
    </>
  );
}
