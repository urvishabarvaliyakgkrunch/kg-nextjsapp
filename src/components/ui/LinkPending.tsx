// src/components/ui/LinkPending.tsx
"use client";

import { useLinkStatus } from "next/link";

interface Props {
  // Spinner colours — change them when the button background is light
  className?: string;
}

// Put this INSIDE a <Link> — it spins while Next.js fetches the next page
export default function LinkPending({
  className = "border-white/40 border-t-white",
}: Props) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    // Fades in after ~100ms, so a fast page change does not flash a spinner
    <span
      role="status"
      aria-label="Loading page"
      className="ml-1 inline-flex animate-pending-fade"
    >
      <span
        className={`h-3 w-3 animate-spin rounded-full border-2 ${className}`}
      />
    </span>
  );
}
