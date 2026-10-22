// app/account/addresses/[type]/loading.tsx

import AccountShell from "@/components/account/AccountShell";
import { FormCardSkeleton } from "@/components/account/AccountSkeletons";

export default function Loading() {
  return (
    <AccountShell>
      <FormCardSkeleton fields={9} />
    </AccountShell>
  );
}
