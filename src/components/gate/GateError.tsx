// src/components/gate/GateError.tsx

import Link from "next/link";
import { GATE_COPY, GATE_OPEN_PATH } from "@/lib/ageGateCopy";
import type { GateState } from "@/types/gate";

// Red line above the button. A taken email also gets a link, since that visitor
// cannot get in by trying again.
export default function GateError({ error, emailTaken }: GateState) {
  if (!error) return null;

  return (
    <p
      role="alert"
      className="mb-4 text-center text-[13px] leading-[1.45] text-gate-error"
    >
      {error}{" "}
      {emailTaken ? (
        <Link href={GATE_OPEN_PATH} className="text-gate-blue underline">
          {GATE_COPY.signIn}
        </Link>
      ) : null}
    </p>
  );
}
