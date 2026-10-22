// src/lib/cartRecoveryCopy.ts

// Every word shown on /cart/restore, kept in one place like the other copy files
export const CART_RESTORE = {
  eyebrow: "Welcome back",
  title: "Restoring Your Cart.",
  description: "Putting your research compounds back in your cart.",
  failedTitle: "This Link Has Expired.",
  failedDescription:
    "That cart link is no longer valid, or the order was already completed.",
  failedCtaLabel: "Browse the catalog",
  failedCtaHref: "/shop",
} as const;

// Where a successfully restored shopper lands
export const CART_RESTORE_DONE_HREF = "/cart";
