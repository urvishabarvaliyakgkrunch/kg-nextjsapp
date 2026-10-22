// src/app/account/addresses/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import AccountShell from "@/components/account/AccountShell";
import AddressBlock from "@/components/account/AddressBlock";
import { requireCustomer } from "@/lib/requireCustomer";
import type { GQLAddress } from "@/types/account";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Addresses" };

function hasAddress(address: GQLAddress | null): boolean {
  return Boolean(address?.address1 || address?.firstName);
}

function AddressColumn({
  title,
  address,
  href,
  type,
}: {
  title: string;
  address: GQLAddress | null;
  href: string;
  type: string;
}) {
  const filled = hasAddress(address);

  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-mono text-[30px] font-bold leading-[1.2] text-ink-dark">
        {title}
      </h2>
      <div className="border border-line px-6 py-5">
        <Link href={href} className="font-mono text-[14px] text-blue hover:underline">
          {filled ? `Edit ${type} address` : `Add ${type} address`}
        </Link>
        <div className="mt-3">
          {filled ? (
            <AddressBlock address={address} />
          ) : (
            <p className="font-mono text-[14px] italic text-ink">
              You have not set up this type of address yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function AddressesPage() {
  const { customer } = await requireCustomer();

  return (
    <AccountShell>
      <p className="mb-10 font-mono text-[14px] text-ink">
        The following addresses will be used on the checkout page by default.
      </p>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <AddressColumn
          title="Billing address"
          type="Billing"
          address={customer.billing}
          href="/account/addresses/billing"
        />
        <AddressColumn
          title="Shipping address"
          type="Shipping"
          address={customer.shipping}
          href="/account/addresses/shipping"
        />
      </div>
    </AccountShell>
  );
}
