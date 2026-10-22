// src/lib/cartCopy.ts

// Both /cart and its loading screen print this hero, so the text lives in one place
export const CART_HERO = {
  eyebrow: "Research compounds cart overview",
  title: "Research Cart.",
  description:
    "Review your selected research compounds before proceeding to secure checkout.",
} as const;

export const CART_LOYALTY = {
  message: "You have points earned choose your rewards",
  ctaLabel: "Click Here",
  href: "/account",
} as const;
