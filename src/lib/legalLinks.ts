// src/lib/legalLinks.ts
// Pill nav shared by the four policy pages — move to a WP menu when the backend exposes one.

import type { LegalLink } from "@/types/legal";

export const LEGAL_LINKS: LegalLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
];
