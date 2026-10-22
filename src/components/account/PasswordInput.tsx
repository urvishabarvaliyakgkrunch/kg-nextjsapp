// src/components/account/PasswordInput.tsx
"use client";

import { useState } from "react";

interface Props {
  name: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {hidden ? <path d="m3 3 18 18" /> : null}
    </svg>
  );
}

// Password box with the show/hide eye the live site has
export default function PasswordInput({
  name,
  label,
  autoComplete,
  required,
  error,
}: Props) {
  const [visible, setVisible] = useState(false);
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-mono text-[14px] text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-[46px] w-full border bg-white px-4 pr-12 font-mono text-[14px] text-ink-dark outline-none transition-colors focus:border-blue ${
            error ? "border-danger" : "border-line"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-alt hover:text-ink"
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="font-mono text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
