// src/components/product/CompoundProfile.tsx

import Image from "next/image";
import type { ProductMeta } from "@/types/product";

const PROFILE_IMAGE =
  "/media/2026/08/pexels-photo-4031687-1024x683.avif";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(<strong>.*?<\/strong>|<em>.*?<\/em>|<a\s[^>]*>.*?<\/a>)/g);
  return parts.map((part, i) => {
    const strong = part.match(/^<strong>(.*)<\/strong>$/);
    if (strong) return <strong key={i} className="font-bold text-black">{strong[1]}</strong>;
    const em = part.match(/^<em>(.*)<\/em>$/);
    if (em) return <em key={i}>{em[1]}</em>;
    const link = part.match(/^<a\s[^>]*href="([^"]*)"[^>]*>(.*)<\/a>$/);
    if (link)
      return (
        <a key={i} href={link[1]} target="_blank" rel="noopener noreferrer" className="text-blue underline">
          {link[2]}
        </a>
      );
    return part.replace(/<[^>]+>/g, "");
  });
}

export default function CompoundProfile({ meta }: { meta: ProductMeta }) {
  const hasLiterature = meta.literature.length > 0 || meta.researchAreas.length > 0;
  if (!hasLiterature) return null;

  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[30px] px-[10px] py-[30px] min-[768px]:py-[3.84vw]">
        <header className="flex flex-col gap-5 p-[10px]">
          <p className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase leading-[14px] text-blue">
            <span className="block h-px w-[44px] max-w-[34%] bg-blue" aria-hidden="true" />
            Compound Profile
          </p>
          <h2 className="max-w-full font-display text-[32px] font-bold leading-[40px] text-ink-dark min-[769px]:max-w-[60%] min-[769px]:text-[42px] min-[769px]:leading-[50px] min-[1025px]:text-[72px] min-[1025px]:leading-[75px]">
            {meta.compoundProfileTitle}
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-[30px] px-3 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            {meta.compoundProfileDescription && (
              <p className="text-[16px] font-medium leading-[23px] text-lot-body">
                {meta.compoundProfileDescription}
              </p>
            )}

            {meta.coaUrl && (
              <a
                href={meta.coaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-[15px] text-[15px] font-medium capitalize leading-[22px] text-blue"
              >
                View Signed COA
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path
                    d="M1 7.5h12M8.5 3l4.5 4.5L8.5 12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </a>
            )}

            <Image
              src={PROFILE_IMAGE}
              alt="Laboratory"
              width={1024}
              height={683}
              unoptimized
              className="h-[450px] w-full rounded-img object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            {meta.literature.length > 0 && (
              <div className="space-y-[14.4px] text-[16px] font-medium leading-[23px] text-lot-body">
                {meta.literature.map((paragraph) => (
                  <p key={paragraph} className="font-normal">
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            )}

            {meta.researchAreas.length > 0 && (
              <div className="flex flex-col gap-5 rounded-img border border-line bg-white p-[25px] shadow-[0_0_10px_0_rgba(0,0,0,0.09)]">
                <h3 className="font-mono text-[14px] font-medium capitalize leading-4 text-blue">
                  Documented Research Areas
                </h3>
                <ul className="list-disc pl-5 marker:text-marker">
                  {meta.researchAreas.map((area) => (
                    <li
                      key={area}
                      className="border-b border-line py-3.5 text-[14px] leading-[23px] text-lot-body last:border-b-0"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
