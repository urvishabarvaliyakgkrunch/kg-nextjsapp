// src/components/loyalty/ActivitiesSection.tsx
"use client";

import LoyaltySection from "./LoyaltySection";
import Pager from "./Pager";
import RecentActivities from "./RecentActivities";
import { useLoyaltyPages } from "@/hooks/useLoyaltyPages";
import type { LoyaltyHistory } from "@/types/loyalty";

export default function ActivitiesSection({ first }: { first: LoyaltyHistory | null }) {
  const { data, loading, goTo } = useLoyaltyPages("history", first);
  if (!data || (data.items.length === 0 && data.page === 1)) return null;

  return (
    <LoyaltySection title="Recent Activities" className="pb-12">
      {/* The live table sits flat on the page — only the head strip is shaded */}
      <RecentActivities items={data.items} />
      <Pager page={data.page} hasMore={data.hasMore} loading={loading} onGo={goTo} />
    </LoyaltySection>
  );
}
