// app/account/orders/[orderId]/loading.tsx

import AccountShell from "@/components/account/AccountShell";
import { OrderDetailSkeleton } from "@/components/account/AccountSkeletons";

export default function Loading() {
  return (
    <AccountShell>
      <OrderDetailSkeleton />
    </AccountShell>
  );
}
