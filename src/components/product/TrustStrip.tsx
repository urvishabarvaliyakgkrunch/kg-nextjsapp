// src/components/product/TrustStrip.tsx

import { TRUST_STRIP } from "@/lib/productDefaults";

export default function TrustStrip({ items = TRUST_STRIP }: { items?: string[] }) {
  return (
    <section className="border-y border-line bg-cream">
      <ul className="container-site flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
        {items.map((item) => (
          <li
            key={item}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
