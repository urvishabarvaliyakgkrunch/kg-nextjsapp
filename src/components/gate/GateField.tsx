// src/components/gate/GateField.tsx

// Shared look for the gate's email box and research dropdown
export const GATE_CONTROL =
  "w-full border bg-gate-field px-4 font-sans text-[14px] leading-[1.4] text-cream outline-none transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-gate-blue focus:text-white";

// The live site's email box is shorter and greyer than its dropdown, because the WordPress
// theme's own input rule beats age-gate.css there. Copied as-is so the two sites match.
export const GATE_INPUT = `${GATE_CONTROL} rounded-[3px] border-gate-input-line py-2`;

// The dropdown keeps the age-gate.css look the theme never overrode
export const GATE_SELECT = `${GATE_CONTROL} rounded-chip border-gate-field-line py-[14px]`;

interface Props {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}

// Label above, control below — the control is passed in so an input and a select can share this
export default function GateField({ htmlFor, label, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-sans text-[13px] font-medium leading-none text-gate-body"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
