// src/app/account/orders/loading.tsx

import AccountShell from "@/components/account/AccountShell";
import OrdersTableSkeleton from "@/components/account/OrdersTableSkeleton";

export default function Loading() {
  return (
    <AccountShell>
      <OrdersTableSkeleton />
    </AccountShell>
  );
}
