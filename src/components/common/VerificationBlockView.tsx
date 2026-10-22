// src/components/common/VerificationBlockView.tsx

import type { VerificationBlock } from "@/types/verification";

const RICH_TEXT =
  "font-sans text-[16px] [overflow-wrap:anywhere] [&_a]:text-blue [&_p]:mb-[14.4px] [&_strong]:font-bold [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-left min-[768px]:[&_ul]:pl-10";

// Default copy is 97% wide on tablet+; strong and quote copy run full width like live
const BODY_CLASS: Record<NonNullable<Extract<VerificationBlock, { tone: string }>["tone"]> | "default", string> = {
  default: `${RICH_TEXT} w-full font-normal leading-[20.8px] text-lot-body min-[768px]:w-[97%] min-[768px]:leading-[24px]`,
  strong: `${RICH_TEXT} w-full font-medium leading-[20.8px] text-black min-[768px]:leading-[26px]`,
  // Live wraps the address in a widget with 20px top and bottom padding
  address: `${RICH_TEXT} w-full py-5 font-medium leading-[20.8px] text-black min-[768px]:leading-[26px]`,
  quote: `${RICH_TEXT} w-full font-medium leading-[20.8px] text-lot-body min-[768px]:leading-[26px]`,
};

export default function VerificationBlockView({ block }: { block: VerificationBlock }) {
  if (typeof block !== "string" && "subtitle" in block) {
    return (
      <h3 className="font-display text-[16px] font-bold leading-[27px] text-black">
        {block.subtitle}
      </h3>
    );
  }

  const { html, tone } = typeof block === "string" ? { html: block, tone: "default" as const } : block;

  // Blocks are trusted rich text from our own copy (later WP admin)
  return <div className={BODY_CLASS[tone]} dangerouslySetInnerHTML={{ __html: html }} />;
}
