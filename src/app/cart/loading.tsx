// src/app/cart/loading.tsx

import PageHero from "@/components/common/PageHero";
import CartPageSkeleton from "@/components/cart/CartPageSkeleton";
import { CART_HERO } from "@/lib/cartCopy";

// Next.js shows this the instant someone clicks through to /cart
export default function Loading() {
  return (
    <>
      <section className="bg-white px-[20px] py-[25px]">
        <PageHero
          eyebrow={CART_HERO.eyebrow}
          title={CART_HERO.title}
          description={CART_HERO.description}
        />
      </section>
      <div className="container-site pb-20">
        <CartPageSkeleton />
      </div>
    </>
  );
}
