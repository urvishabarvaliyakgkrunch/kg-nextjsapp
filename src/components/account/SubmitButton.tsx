// src/components/account/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";
import Spinner from "@/components/ui/Spinner";

interface Props {
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "outline";
  // Account forms use a compact button; the sign-in box wants a full-width one
  full?: boolean;
}

// Reads the pending state of the form it sits inside — no props wiring needed
export default function SubmitButton({
  label,
  pendingLabel,
  variant = "primary",
  full = false,
}: Props) {
  const { pending } = useFormStatus();

  const styles =
    variant === "primary"
      ? "bg-[#20397b] text-white hover:bg-atc-hover"
      : "border border-ink-dark bg-white text-ink-dark hover:bg-cream";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-[46px] items-center justify-center gap-2 px-8 font-mono text-[14px] font-medium transition-colors disabled:opacity-50 ${full ? "w-full" : ""} ${styles}`}
    >
      {pending ? <Spinner className="h-4 w-4 border-2" label="Working" /> : null}
      {pending ? (pendingLabel ?? "Please wait…") : label}
    </button>
  );
}