// src/components/legal/LegalSectionView.tsx

import LegalBlockView from "@/components/legal/LegalBlockView";
import type { LegalSection } from "@/types/legal";

// Live policy pages mix three title looks: plain, near-black "featured", and a small mono caption
const TITLE_CLASS = {
  default: "font-display text-[22px] font-bold leading-[28px] text-black",
  featured:
    "font-display text-[25px] font-bold leading-[30px] text-ink-dark min-[768px]:text-[22px] min-[768px]:leading-[28px]",
  label: "font-mono text-[11px] font-semibold leading-[18px] text-muted",
};

export default function LegalSectionView({ title, blocks, titleStyle }: LegalSection) {
  return (
    <div className="flex flex-col gap-5">
      {title && <h2 className={TITLE_CLASS[titleStyle ?? "default"]}>{title}</h2>}
      {blocks.map((block, i) => (
        <LegalBlockView key={i} block={block} />
      ))}
    </div>
  );
}
