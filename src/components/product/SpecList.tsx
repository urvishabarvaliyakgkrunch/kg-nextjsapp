// src/components/product/SpecList.tsx

import type { SpecRow } from "@/types/product";

export default function SpecList({ rows }: { rows: SpecRow[] }) {
  if (rows.length === 0) return null;

  return (
    <dl className="divide-y divide-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-6"
        >
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {row.label}
          </dt>
          <dd className="text-[14px] text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
