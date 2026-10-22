// src/app/cart/restore/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import CartRestorer from "@/components/cart/CartRestorer";
import CartPageSkeleton from "@/components/cart/CartPageSkeleton";
import PageHero from "@/components/common/PageHero";
import { fetchRecoveredCart } from "@/lib/cartRecovery";
import { CART_RESTORE } from "@/lib/cartRecoveryCopy";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// A recovery link is private to one shopper, so search engines must not list it
export const metadata: Metadata = {
  title: "Restore cart",
  robots: { index: false, follow: false },
};

export default async function RestoreCartPage({
  searchParams,
}: {
  searchParams: Promise<{ wcf_ac_token?: string }>;
}) {
  const { wcf_ac_token: token } = await searchParams;
  const cart = token ? await fetchRecoveredCart(token) : null;

  // Expired, already used or edited link: say so and offer the catalog
  if (!cart) {
    return (
      <section className="bg-white px-[20px] py-[25px]">
        <PageHero
          eyebrow={CART_RESTORE.eyebrow}
          title={CART_RESTORE.failedTitle}
          description={CART_RESTORE.failedDescription}
        />
        <div className="mt-6 text-center">
          <Link
            href={CART_RESTORE.failedCtaHref}
            className="inline-block rounded-chip bg-blue px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            {CART_RESTORE.failedCtaLabel}
          </Link>
        </div>
      </section>
    );
  }

  // Same skeleton as /cart, so the screen does not jump when the redirect lands
  return (
    <>
      <section className="bg-white px-[20px] py-[25px]">
        <PageHero
          eyebrow={CART_RESTORE.eyebrow}
          title={CART_RESTORE.title}
          description={CART_RESTORE.description}
        />
      </section>
      <div className="container-site pb-20">
        <CartPageSkeleton />
      </div>
      <CartRestorer cart={cart} />
    </>
  );
}
