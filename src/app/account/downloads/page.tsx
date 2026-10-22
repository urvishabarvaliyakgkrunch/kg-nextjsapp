// src/app/account/downloads/page.tsx

import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import DownloadsTable from "@/components/account/DownloadsTable";
import NoticeBox from "@/components/account/NoticeBox";
import { getDownloadsPage } from "@/lib/queries/account";
import { ensureCustomer, requireAuthToken } from "@/lib/requireCustomer";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Downloads" };

export default async function DownloadsPage() {
  const authToken = await requireAuthToken();
  const { customer, downloads } = await getDownloadsPage(authToken);
  ensureCustomer(customer);

  return (
    <AccountShell>
      {downloads.length > 0 ? (
        <DownloadsTable items={downloads} />
      ) : (
        <NoticeBox>No downloads available yet.</NoticeBox>
      )}
    </AccountShell>
  );
}
