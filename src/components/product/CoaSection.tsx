// src/components/product/CoaSection.tsx

import Link from "next/link";
import type { ProductMeta } from "@/types/product";

const BUTTON =
  "inline-block border border-outline p-5 text-[18px] font-medium leading-5 transition-opacity hover:opacity-90";

export default function CoaSection({ meta }: { meta: ProductMeta }) {
  if (meta.coaRows.length === 0) return null;

  const chips = [meta.mgPerVial && `${meta.mgPerVial}`, meta.blendType, meta.lotNumber];

  return (
    <section id="coa" className="scroll-mt-24 border-t border-line bg-ruo-bg">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-[20px] py-[30px] min-[768px]:py-[3.84vw] lg:grid-cols-[462fr_395fr] lg:gap-[106px]">
        <div className="flex flex-col gap-5">
          <header className="flex flex-col gap-5 p-2.5">
            <p className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase leading-[14px] text-blue">
              <span className="block h-px w-[60px] max-w-[34%] bg-blue" aria-hidden="true" />
              Transparency
            </p>
            <h2 className="font-display text-[32px] font-bold leading-[40px] text-ink-dark min-[769px]:text-[42px] min-[769px]:leading-[50px] min-[1025px]:text-[72px] min-[1025px]:leading-[75px]">
              Every lot. Every researcher. Same proof.
            </h2>
          </header>
          <p className="text-[16px] leading-[23px] text-lot-body">
            Each batch ships with a third-party Certificate of Analysis from
            Optiq Health Labs. HPLC purity, mass-spectrometry identity, net
            content, and LAL endotoxin screening. Every test, every lot.
          </p>
          <p className="text-[16px] leading-[23px] text-lot-body">
            Your lot number ships on the label and on the COA. Enter it in the
            verifier any time to retrieve the original lab report.
          </p>

          <div className="flex flex-wrap gap-5 p-2.5">
            {meta.lotNumber && (
              <Link
                href={`/coas?lot=${encodeURIComponent(meta.lotNumber)}`}
                className={`${BUTTON} bg-ink-dark text-white`}
              >
                Verify Batch COA
              </Link>
            )}
            {meta.coaUrl && (
              <a
                href={meta.coaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON} rounded-[3px] bg-white text-ink-dark`}
              >
                Download Sample COA
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 self-start rounded-img border border-line bg-white p-[25px] shadow-[0_0_10px_0_rgba(0,0,0,0.09)]">
          <h2 className="font-display text-[22px] font-medium capitalize leading-6 text-ink-dark">
            Certificate of Analysis
          </h2>
          <ul className="-mx-2 flex flex-wrap font-mono text-[11px] font-medium leading-[18px] text-muted-2">
            {chips.filter(Boolean).map((chip, i) => (
              <li key={chip} className="mx-2 flex items-center">
                {i < 2 && (
                  <span className="mr-[3px] block h-[3px] w-1 bg-muted-2" aria-hidden="true" />
                )}
                {chip}
              </li>
            ))}
          </ul>

          <dl>
            {meta.coaRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-5 border-b border-dashed border-coa-rule py-3.5 text-[15px] leading-[21px]"
              >
                <dt className="font-medium tracking-[0.3px] text-coa-label">
                  {row.label}
                </dt>
                <dd
                  className={`text-right font-semibold ${
                    row.pass ? "text-coa-pass" : "text-coa-value"
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
