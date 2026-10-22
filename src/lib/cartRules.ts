// src/lib/cartRules.ts
// Shop-wide cart rules kept in one place so the drawer and cart page agree.

// Fallback only — the live value comes from the Woo "Free shipping" method (lib/shippingRules.ts)
export const FREE_SHIPPING_MINIMUM = 150;

export interface FreeShippingProgress {
  qualified: boolean;
  remaining: number;
  percent: number; // 0–100, for the drawer progress bar
}

export function freeShippingProgress(
  subtotal: number,
  minimum: number = FREE_SHIPPING_MINIMUM
): FreeShippingProgress {
  const qualified = subtotal >= minimum;
  return {
    qualified,
    remaining: qualified ? 0 : minimum - subtotal,
    percent: Math.min(100, (subtotal / minimum) * 100),
  };
}
