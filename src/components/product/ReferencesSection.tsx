// src/components/product/ReferencesSection.tsx

import SectionHeader from "./SectionHeader";
import type { Reference } from "@/types/product";

interface Props {
  references: Reference[];
  productName: string;
}

export default function ReferencesSection({ references, productName }: Props) {
  if (references.length === 0) return null;

  return (
    <section className="border-t border-line bg-ruo-bg">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-[30px] min-[768px]:py-[3.84vw] md:px-0">
        <SectionHeader
          eyebrow="Selected Studies · Peer-Reviewed Literature"
          description={`A curated list of published peer-reviewed papers indexed in PubMed where ${productName} has been studied. Provided for research-context only. Linking to the literature does not constitute endorsement of any therapeutic application.`}
          descriptionSize="sm"
        />

        <ol className="my-8 grid grid-cols-1 gap-4 py-2 font-mono md:grid-cols-2">
          {references.map((ref, i) => (
            <li
              key={ref.pubmedUrl || ref.title}
              className="flex flex-col gap-2.5 rounded-[10px] border border-ref-line bg-white p-5"
            >
              <span className="text-[11px] font-bold leading-[11px] tracking-[0.88px] text-ref-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[11px] leading-[16.5px] text-ref-meta">
                <span className="font-semibold text-ref-author">{ref.authors}</span>
                {ref.journal && (
                  <>
                    {" "}
                    · <em className="font-medium text-ref-author">{ref.journal}</em>
                  </>
                )}
              </p>
              <h3 className="text-[13px] font-bold leading-[20.15px] text-ref-title">
                {ref.title}
              </h3>
              {ref.pubmedUrl && (
                <a
                  href={ref.pubmedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-fit items-center gap-1.5 rounded-btn border-2 border-ref-line p-[15px] text-[11px] font-bold uppercase leading-[22.4px] tracking-[0.44px] text-ref-blue transition-opacity hover:opacity-70"
                >
                  PubMed · {ref.pubmedId}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
