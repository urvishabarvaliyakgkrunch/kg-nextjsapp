// src/app/account/addresses/[type]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import AddressForm from "@/components/account/AddressForm";
import { getLocationOptions } from "@/lib/queries/account";
import { requireCustomer } from "@/lib/requireCustomer";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Edit address" };

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (type !== "billing" && type !== "shipping") notFound();

  // Both are independent, so never wait for one before starting the other
  const [{ customer }, locations] = await Promise.all([
    requireCustomer(),
    getLocationOptions(),
  ]);

  const address = type === "billing" ? customer.billing : customer.shipping;
  const title = type === "billing" ? "Billing address" : "Shipping address";

  return (
    <AccountShell>
      <h2 className="mb-8 font-mono text-[30px] font-bold leading-[1.2] text-ink-dark">
        {title}
      </h2>
      <AddressForm type={type} address={address} locations={locations} />
    </AccountShell>
  );
}
