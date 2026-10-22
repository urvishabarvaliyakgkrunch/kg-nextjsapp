// src/lib/storeCart.ts
// Small helpers for reading WooCommerce Store API values.

// Store API sends money as minor units in a string — "4700" means $47.00
export function toMoney(raw: string | undefined, minorUnit = 2): number {
  const value = parseInt(raw ?? "0", 10);
  if (!Number.isFinite(value)) return 0;
  return value / Math.pow(10, minorUnit);
}

// Woo escapes quotes in error messages, so decode before showing them to a shopper
export function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#039;|&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&times;/g, "×")
    .replace(/&nbsp;/g, " ");
}
