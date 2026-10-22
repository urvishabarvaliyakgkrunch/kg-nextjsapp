// src/components/account/OrderDetail.tsx

import Link from "next/link";
import AddressBlock from "@/components/account/AddressBlock";
import OrderLines from "@/components/account/OrderLines";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderTotals from "@/components/account/OrderTotals";
import { formatOrderDate } from "@/lib/order";
import type { GQLOrderDetail } from "@/types/account";

export default function OrderDetail({ order }: { order: GQLOrderDetail }) {
  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/account/orders"
        className="font-mono text-[14px] text-blue hover:underline"
      >
        &larr; Back to orders
      </Link>

      <p className="font-mono text-[14px] leading-[1.9] text-ink">
        Order <strong className="font-bold text-ink-dark">#{order.orderNumber}</strong> was
        placed on{" "}
        <strong className="font-bold text-ink-dark">{formatOrderDate(order.date)}</strong>{" "}
        and is currently <OrderStatusBadge status={order.status} />.
      </p>

      <section className="flex flex-col gap-5">
        <h2 className="font-mono text-[24px] font-bold text-ink-dark">Order details</h2>
        <OrderLines items={order.lineItems.nodes} />
        <OrderTotals order={order} />
      </section>

      {order.customerNote ? (
        <section className="border border-line px-6 py-5">
          <h2 className="mb-2 font-mono text-[16px] font-bold text-ink-dark">Order note</h2>
          <p className="font-mono text-[14px] text-ink">{order.customerNote}</p>
        </section>
      ) : null}

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <section className="flex flex-col gap-5">
          <h2 className="font-mono text-[24px] font-bold text-ink-dark">Billing address</h2>
          <div className="border border-line px-6 py-5">
            <AddressBlock address={order.billing} />
          </div>
        </section>
        <section className="flex flex-col gap-5">
          <h2 className="font-mono text-[24px] font-bold text-ink-dark">Shipping address</h2>
          <div className="border border-line px-6 py-5">
            <AddressBlock address={order.shipping} />
          </div>
        </section>
      </div>
    </div>
  );
}
