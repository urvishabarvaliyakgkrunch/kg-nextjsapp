// src/lib/verificationLinks.ts
// Pill nav shared by every verification page — move to a WP menu when the backend exposes one.

import type { VerificationLink } from "@/types/verification";

export const VERIFICATION_LINKS: VerificationLink[] = [
  { label: "COA Library", href: "/coas" },
  { label: "Lab Partner", href: "/lab-partner" },
  { label: "Test Methods", href: "/test-methods" },
  { label: "Quality Standards", href: "/quality-standards" },
  { label: "Research", href: "/research" },
];
