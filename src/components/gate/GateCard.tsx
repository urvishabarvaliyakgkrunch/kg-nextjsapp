// src/components/gate/GateCard.tsx

import Link from "next/link";
import GateForm from "@/components/gate/GateForm";
import { GATE_COPY, GATE_EXIT_URL, GATE_OPEN_PATH } from "@/lib/ageGateCopy";

// The dark panel in the middle of the gate. Chrome only — the form holds every piece of state.
export default function GateCard() {
  return (
    <div className="w-full max-w-[520px] rounded-card border border-gate-line bg-ink-dark px-6 pb-7 pt-8 text-cream sm:px-10 sm:pb-9 sm:pt-11">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gate-blue-line bg-gate-blue-bg px-3 py-1.5 font-mono text-[11px] font-medium uppercase leading-[22.4px] tracking-[0.18em] text-gate-blue">
        <span className="animate-gate-dot size-1.5 rounded-full bg-gate-blue" />
        {GATE_COPY.eyebrow}
      </span>

      <h2
        id="gate-title"
        className="mb-4 mt-2 font-display text-[28px] font-bold leading-[1.05] tracking-[-0.025em] text-cream sm:text-[36px]"
      >
        {GATE_COPY.title}
      </h2>

      {GATE_COPY.intro.map((line) => (
        <p
          key={line}
          className="mb-4 text-[14px] leading-[1.55] text-gate-body sm:text-[15px]"
        >
          {line}
        </p>
      ))}

      <GateForm />

      <p className="mt-5 text-center font-mono text-[10px] uppercase leading-[22.4px] tracking-[0.14em] text-gate-foot">
        {GATE_COPY.footnote}{" "}
        <Link href={GATE_OPEN_PATH} className="text-gate-blue underline">
          {GATE_COPY.signIn}
        </Link>
        {" · "}
        {/* Leaves the site entirely, so a plain anchor and not a Next link */}
        <a href={GATE_EXIT_URL} className="text-gate-blue underline">
          {GATE_COPY.exit}
        </a>
      </p>
    </div>
  );
}
