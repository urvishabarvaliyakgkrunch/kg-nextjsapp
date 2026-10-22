// src/components/legal/LegalEyebrow.tsx

// Live .catalog-eyebrow chip: blue dot with a soft ring, mono uppercase label
export default function LegalEyebrow({ label }: { label: string }) {
  return (
    <div className="m-[5px] inline-flex items-center gap-2 rounded-full border border-ruo-border bg-ruo-bg px-[14px] py-[7px] font-mono text-[11px] font-normal uppercase leading-[22.4px] tracking-[0.18em] text-lot-body">
      <span
        className="size-1.5 shrink-0 rounded-full bg-hero-dot shadow-[0_0_0_4px_var(--color-hero-dot-ring)]"
        aria-hidden="true"
      />
      {label}
    </div>
  );
}
