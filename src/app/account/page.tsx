// src/app/account/page.tsx

import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import AuthPanel from "@/components/account/AuthPanel";
import DashboardSummary from "@/components/account/DashboardSummary";
import FormBanner from "@/components/account/FormBanner";
import PageHero from "@/components/common/PageHero";
import { ACCOUNT_HERO } from "@/lib/accountCopy";
import { getAuthToken } from "@/lib/auth";
import { getCustomer } from "@/lib/queries/account";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "My account",
  description: ACCOUNT_HERO.description,
  // Signed-in area — keep it out of search results
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ ml_error?: string }>;
}) {
  const [{ ml_error: magicLinkFailed }, authToken] = await Promise.all([
    searchParams,
    getAuthToken(),
  ]);
  const customer = authToken ? await getCustomer(authToken).catch(() => null) : null;

  // Same URL for both states, exactly like the WooCommerce my-account page
  if (!customer) {
    return (
      <>
        <section className="container-site pt-10 md:pt-[60px]">
          <PageHero {...ACCOUNT_HERO} />
        </section>
        <section className="container-site py-10 md:py-[60px]">
          <div className="mx-auto w-full max-w-[670px]">
            {magicLinkFailed ? (
              <div className="mb-6">
                <FormBanner error="This sign-in link is invalid or has expired. Please request a new one." />
              </div>
            ) : null}
          </div>
          <AuthPanel />
        </section>
      </>
    );
  }

  return (
    <AccountShell>
      <DashboardSummary customer={customer} />
    </AccountShell>
  );
}
