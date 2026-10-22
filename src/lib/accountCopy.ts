// src/lib/accountCopy.ts

// The hero sits on top of every account page, so the text lives in one place
export const ACCOUNT_HERO = {
  eyebrow: "Secure account",
  title: "Research Dashboard.",
  description:
    "Access your research dashboard to manage laboratory orders, review account activity, update account details, and securely track your research purchases.",
} as const;

// Same tabs, same order as the WooCommerce my-account page
export const ACCOUNT_TABS = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Downloads", href: "/account/downloads" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Account Details", href: "/account/details" },
  { label: "Points & Rewards", href: "/account/points" },
] as const;

export const TERMS_LINKS = {
  terms: "/terms-of-service",
  privacy: "/privacy-policy",
} as const;
