// src/components/account/OrderTotals.tsx

import type { GQLOrderDetail } from "@/types/account";

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className={`font-mono text-[14px] ${strong ? "font-bold text-ink-dark" : "text-ink"}`}>
        {label}
      </span>
      <span className={`font-mono text-[14px] ${strong ? "font-bold text-ink-dark" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}

export default function OrderTotals({ order }: { order: GQLOrderDetail }) {
  // Woo sends "$0.00" rather than null for unused lines — hide those rows
  const isZero = (value: string | null) => !value || /^[^\d]*0([.,]00)?$/.test(value);

  return (
    <div className="divide-y divide-line border border-line">
      <Row label="Subtotal" value={order.subtotal ?? "—"} />
      {!isZero(order.discountTotal) ? (
        <Row label="Discount" value={`-${order.discountTotal}`} />
      ) : null}
      <Row label="Shipping" value={order.shippingTotal ?? "—"} />
      {!isZero(order.totalTax) ? <Row label="Tax" value={order.totalTax ?? ""} /> : null}
      <Row label="Total" value={order.total ?? "—"} strong />
      {order.paymentMethodTitle ? (
        <Row label="Paid with" value={order.paymentMethodTitle} />
      ) : null}
    </div>
  );
}
