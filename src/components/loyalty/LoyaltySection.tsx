// src/components/loyalty/LoyaltySection.tsx

interface Props {
  title: string;
  // Extra spacing the live page gives some blocks
  className?: string;
  // Tighter heading for the cart popup, smaller on phones
  compact?: boolean;
  children: React.ReactNode;
}

// Every block on this page carries the same heading: a short upright rule, then the label in
// widely spaced mono caps. Measured from the live page: 16px, 0.2em tracking, 32px below.
export default function LoyaltySection({ title, className, compact, children }: Props) {
  return (
    <section className={className}>
      <h2
        className={[
          "flex items-center gap-[4px] font-mono uppercase leading-[1.2] tracking-[.05em] text-ink-dark",
          compact ? "mb-5 text-[16px] md:mb-[30px] md:text-[20px] font-bold" : "mb-[45px] text-[20px] font-normal",
        ].join(" ")}
        style={{
          fontFamily: compact
            ? 'var(--font-inter), sans-serif !important'
            : 'var(--font-jetbrains-mono), monospace !important'
        }}
      >
 
        <span aria-hidden="true" className="h-[24px] w-[3px] bg-ink-dark" />
        {title}
      </h2>
      {children}
    </section>
  );
}
