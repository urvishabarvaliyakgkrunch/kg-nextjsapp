// src/components/account/DashboardSummary.tsx

import Link from "next/link";
import LogoutLink from "@/components/account/LogoutLink";
import type { GQLCustomer } from "@/types/account";

const LINK = "text-blue underline-offset-2 hover:underline";

// Same wording as the WooCommerce dashboard tab
export default function DashboardSummary({ customer }: { customer: GQLCustomer }) {
  const name = customer.displayName || customer.firstName || customer.username || "there";

  return (
    <div className="border border-line px-7 py-6 font-mono text-[14px] leading-[1.9] text-ink">
      {/* A div, not a p — "Log out" is a form, and HTML forbids a form inside a p */}
      <div>
        Hello <strong className="font-bold text-ink-dark">{name}</strong> (not {name}?{" "}
        <LogoutLink />)
      </div>

      <p className="mt-4">
        From your account dashboard you can view your{" "}
        <Link href="/account/orders" className={LINK}>
          recent orders
        </Link>
        , manage your{" "}
        <Link href="/account/addresses" className={LINK}>
          shipping and billing addresses
        </Link>
        , and{" "}
        <Link href="/account/details" className={LINK}>
          edit your password and account details
        </Link>
        .
      </p>
    </div>
  );
}
