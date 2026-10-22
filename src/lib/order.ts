// src/lib/order.ts
// Order display helpers — pure functions, no React.

// WooGraphQL sends statuses as enum names like ON_HOLD; shoppers should read "On hold"
export function statusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export type StatusTone = "ok" | "busy" | "bad" | "neutral";

export function statusTone(status: string): StatusTone {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "ok";
    case "PROCESSING":
    case "PENDING":
    case "ON_HOLD":
      return "busy";
    case "CANCELLED":
    case "FAILED":
    case "REFUNDED":
      return "bad";
    default:
      return "neutral";
  }
}

// Woo returns dates in site time without a zone, e.g. "2026-01-14T09:12:33"
export function formatOrderDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// "3 items" reads better than a bare number in the orders list
export function itemCountLabel(quantities: (number | null)[]): string {
  const total = quantities.reduce<number>((sum, qty) => sum + (qty ?? 0), 0);
  return `${total} ${total === 1 ? "item" : "items"}`;
}
