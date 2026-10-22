// src/app/account/points/page.tsx

import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import NoticeBox from "@/components/account/NoticeBox";
import PointsPageClient from "@/components/loyalty/PointsPageClient";
import { requireCustomer } from "@/lib/requireCustomer";
import {
  getLoyaltySummary,
  getLoyaltyHistory,
  getLoyaltyCoupons,
} from "@/lib/loyalty";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Points & Rewards" };

export default async function PointsPage() {
  const { authToken } = await requireCustomer();

  // Fetch everything in parallel — all three calls are independent
  const [summary, history, activeCoupons, expiredCoupons] = await Promise.all([
    getLoyaltySummary(authToken),
    getLoyaltyHistory(authToken, 1, 10),
    getLoyaltyCoupons(authToken, "active", 1, 10),
    getLoyaltyCoupons(authToken, "expired", 1, 10),
  ]);

  // WP plugin not active or endpoint not responding yet
  if (!summary) {
    return (
      <AccountShell>
        <NoticeBox>
          Points &amp; rewards are not available right now. Please try again shortly.
        </NoticeBox>
      </AccountShell>
    );
  }

  return (
    <AccountShell wide>
      <PointsPageClient
        summary={summary}
        history={history}
        activeCoupons={activeCoupons}
        expiredCoupons={expiredCoupons}
      />
    </AccountShell>
  );
}
