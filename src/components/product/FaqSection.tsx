// src/components/product/FaqSection.tsx
"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";
import type { FaqItem } from "@/types/product";

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState(-1);
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-line bg-ruo-bg">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-[10px] py-[30px] min-[768px]:py-[3.84vw]">
        <SectionHeader eyebrow="Common Questions" title="Answered straight." />

        <ul className="mx-[10px] mb-5 mt-2.5 flex flex-col">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <li
                key={faq.question}
                className="-mt-px mb-3 transform rounded-[20px] border border-[#0165ff] bg-white px-4 py-4 transition-all duration-200 ease-in-out hover:-translate-y-[2px] hover:border-[#0165ff] hover:shadow-[0_12px_35px_rgba(1,101,255,0.08)] md:mb-5 md:px-5 md:py-[25px]"
              >
                <h4>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className="font-display text-[16px] font-semibold leading-[21px] text-ink-dark md:text-[18px] md:leading-[22px]">
                      {faq.question}
                    </span>
                    <span className="shrink-0 text-[24px] leading-none text-blue" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h4>
                {isOpen && (
                  <div
                    className="pt-[15px] text-[15px] leading-[27px] text-faq-body [&_strong]:font-bold"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </li>
        
            );
          })}
        </ul>
      </div>
    </section>
  );
}
