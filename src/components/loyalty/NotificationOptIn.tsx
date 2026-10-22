// src/components/loyalty/NotificationOptIn.tsx
"use client";

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

// No card around this one — the live page prints it straight on the background
export default function NotificationOptIn({ checked, onChange }: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-[10px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-[14px] w-[14px] accent-blue"
      />
      <span className="font-sans text-[16px] text-ink">
        Opt-in for receiving points &amp; rewards emails
      </span>
    </label>
  );
}
