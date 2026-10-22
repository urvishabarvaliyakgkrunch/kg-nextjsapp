// src/app/cart/page.tsx

import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";
import PageHero from "@/components/common/PageHero";
import { CART_HERO } from "@/lib/cartCopy";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "Cart",
  description: CART_HERO.description,
  // A cart is per-visitor — nothing to index
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <section className="bg-white px-[20px] py-[40px] min-[768px]:py-[25px]">
        <PageHero
          eyebrow={CART_HERO.eyebrow}
          title={CART_HERO.title}
          description={CART_HERO.description}
        />
      </section>
      <div className="container-site pb-[30px] min-[768px]:pb-20">
        <div className="">
          <CartPageClient />
        </div>
      </div>
    </>
  );
}
