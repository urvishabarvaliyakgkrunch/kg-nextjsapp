// src/components/gate/GateCheck.tsx
"use client";

interface Props {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  // The second row draws the closing rule under the pair
  last?: boolean;
}

// One acknowledgement row. The native box is hidden and a square plus tick is drawn instead,
// because a default checkbox cannot be styled for the dark panel.
export default function GateCheck({ id, name, label, checked, onChange, last }: Props) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer select-none items-start gap-3 border-t border-gate-line py-[14px] text-[13px] leading-[1.5] text-cream sm:text-[14px] ${
        last ? "border-b" : ""
      }`}
    >
      <span className="relative mt-px inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer size-[22px] cursor-pointer appearance-none rounded-chip border-[1.5px] border-gate-check-line bg-transparent transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gate-blue checked:border-gate-blue checked:bg-gate-blue"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute inset-0 m-auto hidden size-[14px] peer-checked:block"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}
