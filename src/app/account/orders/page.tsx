// src/app/account/orders/page.tsx

import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import NoticeBox from "@/components/account/NoticeBox";
import OrdersTable from "@/components/account/OrdersTable";
import { getOrdersPage } from "@/lib/queries/account";
import { ensureCustomer, requireAuthToken } from "@/lib/requireCustomer";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const authToken = await requireAuthToken();
  const { customer, orders } = await getOrdersPage(authToken);
  ensureCustomer(customer);

  return (
    <AccountShell>
      {orders.length > 0 ? (
        <OrdersTable orders={orders} />
      ) : (
        <NoticeBox>No order has been made yet.</NoticeBox>
      )}
    </AccountShell>
  );
}
