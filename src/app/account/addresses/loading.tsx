// app/account/addresses/loading.tsx

import AccountShell from "@/components/account/AccountShell";
import { AddressesSkeleton } from "@/components/account/AccountSkeletons";

export default function Loading() {
  return (
    <AccountShell>
      <AddressesSkeleton />
    </AccountShell>
  );
}
