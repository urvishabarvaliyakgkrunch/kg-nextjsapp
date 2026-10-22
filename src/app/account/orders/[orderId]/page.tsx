// src/app/account/orders/[orderId]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import OrderDetail from "@/components/account/OrderDetail";
import { getOrderPage } from "@/lib/queries/account";
import { ensureCustomer, requireAuthToken } from "@/lib/requireCustomer";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Order details" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [{ orderId }, authToken] = await Promise.all([params, requireAuthToken()]);

  const databaseId = Number(orderId);
  if (!Number.isInteger(databaseId)) notFound();

  const { customer, order } = await getOrderPage(authToken, databaseId);
  ensureCustomer(customer);

  // WordPress refuses orders that belong to someone else, so a miss means "not found"
  if (!order) notFound();

  return (
    <AccountShell>
      <OrderDetail order={order} />
    </AccountShell>
  );
}
