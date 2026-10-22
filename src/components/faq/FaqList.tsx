// src/components/faq/FaqList.tsx

import type { FaqPageBlock } from "@/types/faq";

const ANSWER_CLASS =
  "w-full font-sans text-[16px] font-normal leading-[24px] text-lot-body [overflow-wrap:anywhere] min-[768px]:w-[97%] [&_a]:text-blue [&_p]:mb-[14.4px] [&_strong]:font-bold [&_strong]:text-black";

// Answers come from the WP admin (WYSIWYG) and are cleaned by acfHtml in the mapper
function Answer({ html }: { html: string }) {
  return <div className={ANSWER_CLASS} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function FaqList({ blocks }: { blocks: FaqPageBlock[] }) {
  return (
    <section
      aria-label="Frequently asked questions"
      className="bg-white px-5 py-[30px] min-[768px]:px-0 min-[768px]:py-[60px]"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Live column: 76% wide from tablet up, 10px inner pad, 20px between every row */}
        <div className="mx-auto flex w-full flex-col gap-5 border-b border-hero-border p-[10px] min-[768px]:w-[76%]">
          {blocks.map((block, i) => {
            if (block.type === "group") {
              return (
                <h2
                  key={i}
                  className="font-display text-[25px] font-bold leading-[30px] text-ink-dark min-[768px]:text-[26px] min-[768px]:leading-[28px]"
                >
                  {block.title}
                </h2>
              );
            }
            if (block.type === "answer") return <Answer key={i} html={block.answer} />;
            return (
              <div key={i} className="contents">
                <h3 className="font-display text-[22px] font-bold leading-[28px] text-black">
                  {block.title}
                </h3>
                <Answer html={block.answer} />
              </div>
            );
          })}
          <div aria-hidden="true" className="h-[50px]" />
        </div>
      </div>
    </section>
  );
}
