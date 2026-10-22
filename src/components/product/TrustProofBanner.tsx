// src/components/product/TrustProofBanner.tsx

import Image from "next/image";
import Link from "next/link";

// Banner photo is only served from the live site's uploads

const STATS = [
  { label: "Verified Purity", value: "99%+" },
  { label: "Quality Assured", value: "100%" },
  { label: "Produced", value: "USA" },
];

export default function TrustProofBanner() {
  return (
    <section className="relative min-h-[700px] overflow-hidden bg-ink-dark bg-[url('/images/products_with_vials.webp')] bg-cover bg-center bg-no-repeat text-white min-[768px]:min-h-[557px] min-[768px]:bg-auto min-[768px]:bg-[50%] min-[768px]:bg-right">
      {/* <Image
        src={BANNER_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="object-contain object-right max-md:opacity-30"
      /> */}
      {/* Dark left side keeps the copy readable over the photo */}
      <div
        className="md:hidden absolute inset-0 opacity-85"
        style={{ backgroundImage: "linear-gradient(90deg, #0a0a0a 100%, #F2295B00 100%)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] items-center px-[20px] py-[60px] min-[768px]:min-h-[557px]">
        <div className="flex max-w-[560px] flex-col gap-5">
          <h2 className="font-display text-[32px] font-bold leading-[40px] md:text-[42px] md:leading-[50px] min-[1025px]:text-[72px] min-[1025px]:leading-[75px]">
            Research You Can Trust.
          </h2>
          <p className="text-[16px] leading-[23px] text-white">
            At Elixser Peptides, quality comes first. Our peptides are produced
            using advanced manufacturing processes and verified through
            comprehensive testing protocols to deliver dependable results for
            research applications.
          </p>

          <dl className="grid md:grid-cols-3 grid-cols-1 md:gap-5 ">
            {STATS.map((stat , i) => (
              <div key={i + 1} className={`flex flex-col-reverse md:py-0 py-[20px] md:border-0 border-t border-[#fff] ${i === 0 ? 'border-t-0' : ''}`}>
                <dt className="text-[14px] leading-[22px]">{stat.label}</dt>
                <dd className="md:text-[40px] text-[32px] font-semibold leading-[58px] text-blue">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="#buy-box"
            className="w-fit mx-auto md:mx-0 rounded-[3px] bg-blue p-[15px] text-[18px] font-medium leading-5 text-white transition-opacity hover:opacity-90"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </section>
  );
}
