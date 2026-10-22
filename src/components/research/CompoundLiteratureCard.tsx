// src/components/research/CompoundLiteratureCard.tsx

import Link from "next/link";
import type { CompoundLiterature } from "@/types/research";
import { ArrowRightIcon } from "@/components/contact/ContactIcons";
import LiteratureRow from "@/components/research/LiteratureRow";

export default function CompoundLiteratureCard({
  compound,
  productsHref,
  references,
}: CompoundLiterature) {
  return (
    <article className="flex flex-col gap-5 rounded-[12px] border border-field-border p-[15px]">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-field-border min-[768px]:p-[10px]">
        <h3 className="font-display text-[22px] font-bold leading-[35px] text-ink-dark">
          {compound}
        </h3>
        <Link
          href={productsHref}
          className="inline-flex items-center gap-[5px] rounded-full bg-white px-6 py-3 font-mono text-[15px] font-extrabold uppercase leading-[18px] tracking-[1.3px] text-blue min-[768px]:max-[1024px]:p-3"
        >
          View products
          <ArrowRightIcon className="size-[15px]" />
        </Link>
      </div>

      <ul className="flex flex-col gap-5">
        {references.map((reference) => (
          <LiteratureRow key={`${reference.pmid}-${reference.title}`} {...reference} />
        ))}
      </ul>
    </article>
  );
}
