// src/app/shop/page.tsx

import type { Metadata } from "next";
import { getShopPageData } from "@/lib/queries/shop";
import ShopClient from "@/components/shop/ShopClient";
import type { ShopPageData } from "@/types";
import PageHero from "@/components/common/PageHero";

export const metadata: Metadata = {
  title: "Shop — Research Peptides",
  description:
    "Third-party tested research peptides. Signed COA on every vial. Made in the USA.",
  alternates: { canonical: "/shop" },
};

// Shop page uses wider container than default 1200px so 4-col grid fills the screen
const shopContainer = {
  maxWidth: "1600px",
  paddingLeft: "clamp(16px, 3vw, 40px)",
  paddingRight: "clamp(16px, 3vw, 40px)",
};

const NO_PRODUCTS: ShopPageData = {
  products: { nodes: [] },
  productCategories: { nodes: [] },
};

export default async function ShopPage() {
  // GraphQL is the only product source — the Store API gives no variation IDs,
  // so a fallback would quietly add unbuyable lines to the cart
  let data: ShopPageData;
  try {
    data = await getShopPageData();
  } catch {
    data = NO_PRODUCTS;
  }

  return (
    <div className="min-h-screen">
      {/* Hero text */}
      <section className="md:block hidden bg-white px-[60px] pt-[16px] pb-0">
      <PageHero title="The full catalog." description="Every compound below is third-party tested by Optiq Health Labs Analytical, signed COA on every vial, made in the USA. Research use only." isShopPage={true} />
      </section>
      
      {/* Products */}
      <section>
        <div className="mx-auto px-[20px] py-[40px] md:px-[80px] md:pt-[24px] md:pb-[80px]">
          <h2 className="font-display font-bold text-ink-dark mb-8 md:text-[72px] md:leading-[73px] md:tracking-[-0.44px] text-[32px] leading-[40px] ">
            All current research peptides.
          </h2>

          {data.products.nodes.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted text-[15px]">
                Products are temporarily unavailable. Please try again in a moment.
              </p>
            </div>
          ) : (
            <ShopClient
              products={data.products.nodes}
              categories={data.productCategories.nodes}
            />
          )}
        </div>
      </section>
    </div>
  );
}
