// src/components/product/ResearchUseBar.tsx

import { DISCLAIMER } from "@/lib/productDefaults";

// Live store: thin solid grey bar, small white mono caps, centred
export default function ResearchUseBar({ text = DISCLAIMER }: { text?: string }) {
  return (
    <p className="mt-5 bg-[#888888] px-3 py-2 text-center font-mono text-[11px] font-medium uppercase leading-[16px] tracking-[0.04em] text-white md:text-[12px]">
      {text}
    </p>
  );
}
