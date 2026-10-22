// src/components/product/ResearchIntegrityCta.tsx

import Image from "next/image";
import Link from "next/link";


export default function ResearchIntegrityCta() {
  return (
    <section className="relative overflow-hidden bg-ink-dark text-white">
      {/* Placeholder (copy of products_with_vials.jpeg) until the real banner photo is supplied — H5 */}
      <Image src="/images/research-integrity-cta.webp" alt="" fill sizes="100vw" className="object-cover" />
      {/* Fades the photo into the dark left side so the copy stays readable */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(90deg, var(--color-ink-dark) 20%, transparent 50%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto min-h-[700px] max-w-[1440px] px-5 py-[60px] min-[768px]:min-h-[550px]">
        <div className="flex max-w-[469px] flex-col gap-[25px]">
          <h2 className="font-display text-[32px] font-bold leading-[40px] md:text-[42px] md:leading-[50px] min-[1025px]:text-[72px] min-[1025px]:leading-[75px]">
            The standard for research integrity.
          </h2>
          <p className="text-[16px] leading-[23px]">
            Featured Collection – Premium purity compounds crafted with
            consistency, precision, and quality in mind.
          </p>
          <Link
            href="/shop"
            className="w-fit rounded-[3px] border border-outline bg-blue p-5 text-[18px] font-medium leading-5 text-white transition-opacity hover:opacity-90"
          >
            Shop Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
