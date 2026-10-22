// src/components/gate/GateSubmit.tsx

import { GATE_COPY } from "@/lib/ageGateCopy";

interface Props {
  // Stays off until the email, the research field and both ticks are filled in
  ready: boolean;
  pending: boolean;
}

export default function GateSubmit({ ready, pending }: Props) {
  return (
    <button
      type="submit"
      disabled={!ready || pending}
      className="w-full cursor-pointer rounded-chip border border-cream bg-cream px-6 py-4 font-sans text-[14px] font-semibold leading-[normal] tracking-[0.02em] text-ink-dark transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gate-blue hover:bg-gate-blue hover:text-white disabled:cursor-not-allowed disabled:border-gate-off disabled:bg-gate-off disabled:text-gate-off-text disabled:hover:border-gate-off disabled:hover:bg-gate-off disabled:hover:text-gate-off-text"
    >
      {pending ? GATE_COPY.submitPending : GATE_COPY.submit}
    </button>
  );
}
