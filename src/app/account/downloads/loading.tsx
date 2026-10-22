// app/account/downloads/loading.tsx

import AccountShell from "@/components/account/AccountShell";
import { TableSkeleton } from "@/components/account/AccountSkeletons";

export default function Loading() {
  return (
    <AccountShell>
      <TableSkeleton />
    </AccountShell>
  );
}
