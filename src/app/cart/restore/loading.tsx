// src/app/cart/restore/loading.tsx

import PageHero from "@/components/common/PageHero";
import CartPageSkeleton from "@/components/cart/CartPageSkeleton";
import { CART_RESTORE } from "@/lib/cartRecoveryCopy";

// Shown the instant the email link opens, while WordPress hands back the saved cart
export default function Loading() {
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
    </>
  );
}
