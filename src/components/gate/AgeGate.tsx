// src/components/gate/AgeGate.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import GateCard from "@/components/gate/GateCard";
import { GATE_OPEN_PATH } from "@/lib/ageGateCopy";

// Full-screen lockout shown to anyone without a session. The layout decides who sees it;
// this only steps aside on the account routes so an existing customer can still sign in.
export default function AgeGate() {
  const pathname = usePathname();
  const blocking = !pathname.startsWith(GATE_OPEN_PATH);

  // The page underneath must not scroll while the gate covers it
  useEffect(() => {
    if (!blocking) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [blocking]);

  if (!blocking) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      // There is no close button, so Escape must not look like a way out either
      onKeyDown={(event) => {
        if (event.key === "Escape") event.preventDefault();
      }}
      className="animate-gate-in fixed inset-0 z-[999999] flex items-start justify-center overflow-y-auto bg-gate-overlay p-4 pt-8 backdrop-blur-[20px] sm:items-center sm:p-6 sm:pt-6"
    >
      <GateCard />
    </div>
  );
}
