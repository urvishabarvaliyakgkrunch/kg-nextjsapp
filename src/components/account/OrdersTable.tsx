// src/components/account/OrdersTable.tsx

import Link from "next/link";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { formatOrderDate, itemCountLabel } from "@/lib/order";
import type { GQLOrderSummary } from "@/types/account";

// Same columns WooCommerce shows on the Orders tab
const COLUMNS = ["Order", "Date", "Status", "Total", "Actions"];

// Phones get one stacked card per order, each value labelled from data-title;
// from md up the same cells line up as a normal table
const CELL =
  "flex items-center justify-between gap-4 py-2 text-right before:font-bold before:text-ink-dark before:content-[attr(data-title)] md:table-cell md:border-t md:border-row-line md:py-[9px] md:pr-2 md:text-left md:align-middle md:before:content-none";

export default function OrdersTable({ orders }: { orders: GQLOrderSummary[] }) {
  return (
    <div className="border border-row-line bg-white px-4 py-2 md:px-[30px] md:pt-4 md:pb-[3px]">
      <table className="block w-full border-collapse font-mono text-[14px] leading-[21px] text-ink-dark md:table">
        <thead className="hidden md:table-header-group">
          <tr>
            {COLUMNS.map((label) => (
              <th key={label} scope="col" className="pr-2 pb-[9px] text-left font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {orders.map((order) => {
            const href = `/account/orders/${order.databaseId}`;
            return (
              <tr
                key={order.id}
                className="block border-t border-row-line py-2 first:border-t-0 md:table-row md:border-t-0 md:py-0"
              >
                <td data-title="Order" className={CELL}>
                  <Link href={href} className="font-bold text-blue hover:text-atc-hover">
                    #{order.orderNumber}
                  </Link>
                </td>
                <td data-title="Date" className={CELL}>
                  {formatOrderDate(order.date)}
                </td>
                <td data-title="Status" className={CELL}>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td data-title="Total" className={CELL}>
                  <span>
                    {order.total ?? "—"} for{" "}
                    {itemCountLabel(order.lineItems?.nodes.map((l) => l.quantity) ?? [])}
                  </span>
                </td>
                <td data-title="Actions" className={`${CELL} before:hidden`}>
                  <Link
                    href={href}
                    className="inline-flex h-[38px] w-full items-center justify-center bg-blue px-5 font-bold text-white transition-colors hover:bg-atc-hover md:w-[85px] md:px-0"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
