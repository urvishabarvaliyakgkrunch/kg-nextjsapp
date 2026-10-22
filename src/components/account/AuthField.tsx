// src/components/account/AuthField.tsx
"use client";

import { useState } from "react";

type IconName = "user" | "userPlus" | "key" | "at";

interface Props {
  name: string;
  label: string;
  icon: IconName;
  type?: string;
  autoComplete?: string;
  error?: string;
  // Controlled only where the value must survive a mode switch (login box)
  value?: string;
  onValueChange?: (value: string) => void;
}

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    "aria-hidden": true,
  } as const;

  if (name === "at") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </svg>
    );
  }
  if (name === "key") {
    return (
      <svg {...common}>
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="m10.5 12.5 9-9M17 6l2 2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="10" cy="8" r="4" />
      <path d="M2 20c0-4 3.6-7 8-7s8 3 8 7" />
      {name === "userPlus" ? <path d="M19 8h4M21 6v4" /> : null}
    </svg>
  );
}

// Live site login box: grey icon tile on the left, input beside it, eye on the right
export default function AuthField({
  name,
  label,
  icon,
  type = "text",
  autoComplete,
  error,
  value,
  onValueChange,
}: Props) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex items-stretch border bg-white ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <span className="flex w-[52px] shrink-0 items-center justify-center border-r border-line bg-hero-surface text-muted-alt">
          <Icon name={icon} />
        </span>

        <input
          id={name}
          name={name}
          type={isPassword && visible ? "text" : type}
          placeholder={label}
          aria-label={label}
          autoComplete={autoComplete}
          value={value}
          onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-[52px] min-w-0 flex-1 px-4 font-sans text-[14px] text-ink-dark outline-none placeholder:text-muted"
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="flex w-12 shrink-0 items-center justify-center text-muted-alt hover:text-ink"
          >
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
              {visible ? <path d="m3 3 18 18" /> : null}
            </svg>
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="font-sans text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
