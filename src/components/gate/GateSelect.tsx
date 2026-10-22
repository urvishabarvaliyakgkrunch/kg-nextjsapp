// src/components/gate/GateSelect.tsx
"use client";

import GateField, { GATE_SELECT } from "@/components/gate/GateField";
import { GATE_COPY, RESEARCH_FIELDS } from "@/lib/ageGateCopy";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// The browser arrow is hidden so the dark theme can draw its own chevron
export default function GateSelect({ value, onChange }: Props) {
  return (
    <GateField htmlFor="gate-research" label={GATE_COPY.researchLabel}>
      <div className="relative">
        <select
          id="gate-research"
          name="research"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${GATE_SELECT} appearance-none pr-[42px]`}
        >
          <option value="" className="bg-gate-field text-cream">
            {GATE_COPY.researchPlaceholder}
          </option>
          {RESEARCH_FIELDS.map((field) => (
            <option
              key={field.value}
              value={field.value}
              className="bg-gate-field text-cream"
            >
              {field.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-[14px] top-1/2 size-4 -translate-y-1/2 text-cream"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </GateField>
  );
}
