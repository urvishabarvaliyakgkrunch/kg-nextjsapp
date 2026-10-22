// src/app/account/details/page.tsx

import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import DetailsForm from "@/components/account/DetailsForm";
import { requireCustomer } from "@/lib/requireCustomer";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Account details" };

export default async function DetailsPage() {
  const { customer } = await requireCustomer();

  return (
    <AccountShell>
      <DetailsForm customer={customer} />
    </AccountShell>
  );
}
