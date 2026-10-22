// src/lib/formatPrice.ts

// Woo price strings arrive as "$55.00", "<del>$110.00</del>" or a range "$55.00 - $140.25"
export function parsePrice(raw?: string | null): number {
  if (!raw) return 0;
  const plain = raw.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  const first = plain.split("-")[0];
  const n = parseFloat(first.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

// Rounds to cents the same way the WordPress snippet does before dividing per bottle
export function roundCents(value: number): number {
  return parseFloat(value.toFixed(2));
}
