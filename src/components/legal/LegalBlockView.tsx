// src/components/legal/LegalBlockView.tsx

import type { LegalBlock } from "@/types/legal";

// Admin only uses editor buttons: Heading 3 = small sub-heading, Quote = boxed postal address.
// After a paragraph, live leaves 14.4px + 20px before those; after a list only 20px.
const RICH_TEXT = [
  "w-full font-sans text-[16px] leading-[20.8px] [overflow-wrap:anywhere]",
  "[&_a]:text-blue [&_p]:mb-[14.4px] [&_strong]:font-bold [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 min-[768px]:[&_ul]:pl-10",
  "[&_h3]:mb-5 [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:leading-[27px] [&_h3]:text-black",
  "[&_p+h3]:mt-[34.4px] [&_h3+h3]:mt-0 [&_h3:first-child]:mt-0",
  "[&_blockquote]:mt-5 [&_p+blockquote]:mt-[34.4px] [&_blockquote:first-child]:mt-0",
  "[&_blockquote]:rounded-[7px] [&_blockquote]:border-l-[3px] [&_blockquote]:border-blue [&_blockquote]:bg-legal-callout [&_blockquote]:p-5",
  "[&_blockquote]:font-medium [&_blockquote]:text-black min-[768px]:[&_blockquote]:leading-[26px]",
].join(" ");

type Tone = "default" | Extract<LegalBlock, { tone: string }>["tone"];

// Plain copy is 97% wide from tablet up; the heavier tones run full width like live.
// Live gives each plain paragraph its own widget (+20px), refund keeps them in one (14.4px only).
const TONE_CLASS: Record<Tone, string> = {
  default: `${RICH_TEXT} font-normal text-lot-body min-[768px]:w-[97%] min-[768px]:leading-[24px] [&_p+p]:mt-[34.4px]`,
  strong: `${RICH_TEXT} font-medium text-black min-[768px]:leading-[26px]`,
  quote: `${RICH_TEXT} font-medium text-lot-body min-[768px]:leading-[26px]`,
};

export default function LegalBlockView({ block }: { block: LegalBlock }) {
  if (typeof block !== "string" && "divider" in block) {
    return (
      <div className="py-[5px]" aria-hidden="true">
        <div className="border-t border-legal-rule" />
      </div>
    );
  }

  const { html, tone } = typeof block === "string" ? { html: block, tone: "default" as const } : block;

  // Rich text comes from the WP admin (WYSIWYG) and is cleaned by acfHtml in the mapper
  return <div className={TONE_CLASS[tone]} dangerouslySetInnerHTML={{ __html: html }} />;
}
