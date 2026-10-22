// src/components/gate/GateForm.tsx
"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmAgeGateAction } from "@/actions/ageGate";
import GateCheck from "@/components/gate/GateCheck";
import GateError from "@/components/gate/GateError";
import GateField, { GATE_INPUT } from "@/components/gate/GateField";
import GateSelect from "@/components/gate/GateSelect";
import GateSubmit from "@/components/gate/GateSubmit";
import { GATE_COPY } from "@/lib/ageGateCopy";
import { isEmail } from "@/lib/validate";
import type { GateState } from "@/types/gate";

const EMPTY: GateState = {};

export default function GateForm() {
  const router = useRouter();
  const [state, submit, pending] = useActionState(confirmAgeGateAction, EMPTY);

  // Kept in state only so the button can stay dead until all four answers are given
  const [email, setEmail] = useState("");
  const [research, setResearch] = useState("");
  const [ageOk, setAgeOk] = useState(false);
  const [ruoOk, setRuoOk] = useState(false);
  const ready = isEmail(email) && Boolean(research) && ageOk && ruoOk;

  // The session cookie exists by now, so re-render the server tree and the gate drops away
  useEffect(() => {
    if (state.passed) router.refresh();
  }, [state.passed, router]);

  // Handing the action to <form action> would make React blank the fields on every reply,
  // so send it by hand — a rejected email then keeps everything already typed
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-2 mt-6 flex flex-col gap-4">
        <GateField htmlFor="gate-email" label={GATE_COPY.emailLabel}>
          <input
            id="gate-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            autoFocus
            placeholder={GATE_COPY.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${GATE_INPUT} placeholder:text-gate-placeholder`}
          />
        </GateField>

        <GateSelect value={research} onChange={setResearch} />
      </div>

      <div className="mb-7 mt-6">
        <GateCheck
          id="gate-age"
          name="age"
          label={GATE_COPY.ageCheck}
          checked={ageOk}
          onChange={setAgeOk}
        />
        <GateCheck
          id="gate-ruo"
          name="ruo"
          label={GATE_COPY.ruoCheck}
          checked={ruoOk}
          onChange={setRuoOk}
          last
        />
      </div>

      <GateError error={state.error} emailTaken={state.emailTaken} />
      <GateSubmit ready={ready} pending={pending} />
    </form>
  );
}
