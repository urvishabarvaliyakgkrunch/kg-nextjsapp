// src/components/research/LiteratureRow.tsx

import type { LiteratureReference } from "@/types/research";

export default function LiteratureRow({ citation, journal, title, pmid, href }: LiteratureReference) {
  return (
    <li className="flex flex-col justify-between gap-5 border-b border-field-border last:border-b-0 min-[768px]:flex-row min-[768px]:p-[10px]">
      <div className="flex flex-col gap-[10px] p-[10px] text-center min-[768px]:flex-1 min-[768px]:text-left min-[1025px]:max-w-[78%]">
        <p className="font-mono text-[11px] font-medium leading-[18px] text-muted-2">
          {citation} · <span className="italic text-black">{journal}</span>
        </p>
        <p className="mb-[14.4px] font-sans text-[15px] font-medium leading-[22px] text-ink-dark min-[768px]:max-w-[363px] min-[1025px]:max-w-[87%]">
          {title}
        </p>
      </div>

      {href && (
        <div className="flex justify-center p-[10px] min-[768px]:w-[164px] min-[768px]:shrink-0 min-[1025px]:w-[26%] min-[1025px]:max-w-[233px]">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-fit rounded-full border border-field-border bg-pubmed-bg px-6 py-3 text-center font-mono text-[13px] font-bold leading-[18px] tracking-[1px] text-muted-2 transition-colors hover:bg-blue hover:text-white"
          >
            {pmid && `${pmid}`}
          </a>
        </div>
      )}
    </li>
  );
}
