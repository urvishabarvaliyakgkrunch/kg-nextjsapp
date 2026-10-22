// src/components/research/ArticleCard.tsx

import type { ResearchArticle } from "@/types/research";

export default function ArticleCard({ category, title, summary, status }: ResearchArticle) {
  return (
    <article className="rounded-[12px] border border-field-border bg-white p-[10px] transition-[border-color,box-shadow] duration-300 hover:border-blue hover:shadow-[0_0_10px_0_var(--color-card-glow)]">
      <div className="flex h-full flex-col gap-5 p-[10px]">
        <div className="flex items-center justify-between gap-5 p-px">
          <span className="rounded-full bg-contact-icon-bg font-mono text-[15px] font-extrabold uppercase leading-[18px] tracking-[1.3px] text-blue p-3">
            {category}
          </span>
          <span className={`font-mono text-[13px] uppercase leading-[18px] text-muted-2 min-[768px]:max-[1024px]:leading-[15.6px] self-start font-extrabold`}>{status}</span>
        </div>

        <div>
          <h3 className="mb-[6px] mt-2 font-display text-[18px] font-bold leading-[23.4px] tracking-[-0.44px] text-ink-dark min-[768px]:text-[13px] min-[768px]:leading-[16.9px] min-[1025px]:text-[22px] min-[1025px]:leading-[26px]">
            {title}
          </h3>
          <p className="font-mono text-[16px] font-normal leading-[20.8px] tracking-[-0.4px] text-lot-body min-[768px]:text-[11px] min-[768px]:leading-[14.3px] min-[1025px]:text-[16px] min-[1025px]:leading-5 min-[1025px]:tracking-[1.32px]">
            {summary}
          </p>
        </div>

        <span className={`font-mono md:text-[13px] text-[16px] uppercase leading-[18px] md:text-muted-2 text-[#7a7a7a] min-[768px]:max-[1024px]:leading-[15.6px] mt-auto font-bold`}>{status}</span>
      </div>
    </article>
  );
}
