// src/app/checkout/page.tsx

import type { Metadata } from "next";
import CheckoutRedirect from "@/components/checkout/CheckoutRedirect";
import PageHero from "@/components/common/PageHero";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "Checkout",
  description: "Continue to secure checkout.",
  // A handover page has nothing worth indexing
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <section className="bg-white px-[20px] py-[25px]">
        <PageHero
          eyebrow="Secure checkout"
          title="Checkout."
          description="We are handing your cart over to our secure payment partner."
        />
      </section>
      <div className="container-site pb-20">
        <CheckoutRedirect />
      </div>
    </>
  );
}
