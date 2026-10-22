// src/components/loyalty/PointsPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BirthdayDialog from "./BirthdayDialog";
import LoyaltySection from "./LoyaltySection";
import PointsCards from "./PointsCards";
import LevelProgress from "./LevelProgress";
import ReferralLink from "./ReferralLink";
import RewardCard from "./RewardCard";
import CouponsPanel from "./CouponsPanel";
import ActivitiesSection from "./ActivitiesSection";
import WaysToEarnCard from "./WaysToEarnCard";
import NotificationOptIn from "./NotificationOptIn";
import RewardTabs, { type RewardTab } from "./RewardTabs";
import RewardsEmpty from "./RewardsEmpty";
import type { LoyaltySummary, LoyaltyReward, LoyaltyHistory, LoyaltyCoupons } from "@/types/loyalty";

interface Props {
  summary: LoyaltySummary;
  history: LoyaltyHistory | null;
  activeCoupons: LoyaltyCoupons | null;
  expiredCoupons: LoyaltyCoupons | null;
}

export default function PointsPageClient({
  summary,
  history,
  activeCoupons,
  expiredCoupons,
}: Props) {
  const [activeTab, setActiveTab] = useState<RewardTab>("Rewards");
  // Only one reward can be redeemed at a time — lock the others while one is in-flight
  const [redeemingId, setRedeemingId] = useState<number | null>(null);
  // Email opt-in local state (mirrors what WordPress returned)
  const [emailOptIn, setEmailOptIn] = useState(summary.settings.emailOptIn);
  const router = useRouter();
  // Saved birthday (YYYY-MM-DD) and the campaign the open popup is saving for
  const [birthday, setBirthday] = useState(summary.settings.birthday);
  const [birthdayFor, setBirthdayFor] = useState<number | null>(null);

  // Optimistically update the points balance after a successful redeem
  const [localPoints, setLocalPoints] = useState(summary.points);
  // A refresh after saving a birthday can bring birthday points
  useEffect(() => setLocalPoints(summary.points), [summary.points]);

  // The redeemable rewards from the catalogue (rewardTable === "reward")
  const catalogRewards = summary.rewards.filter((r) => r.rewardTable === "reward");

  async function handleRedeem(reward: LoyaltyReward) {
    setRedeemingId(reward.id);
    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rewardId: reward.id,
          rewardTable: reward.rewardTable,
          points: reward.requirePoint,
        }),
      });
      if (res.ok) {
        const data = await res.json() as { points: number };
        // Update the displayed balance to the number WordPress returned
        setLocalPoints(data.points);
        // Switch to the Coupons tab so shopper sees the freshly created coupon
        setActiveTab("Coupons");
        // Reload to pick up the new coupon card from the server
        window.location.reload();
      }
    } finally {
      setRedeemingId(null);
    }
  }

  async function toggleEmailOptIn(value: boolean) {
    setEmailOptIn(value);
    // Fire and forget — if it fails the checkbox snaps back on next reload
    await fetch("/api/loyalty/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOptIn: value }),
    }).catch(() => null);
  }

  function handleBirthdaySaved(date: string) {
    setBirthday(date);
    setBirthdayFor(null);
    router.refresh();
  }

  // The summary carries an updated points value after any redeem
  const displayPoints = localPoints;

  return (
    <div className="space-y-[46px] p-[25px]">
      {/* ── MY POINTS ── */}
      <LoyaltySection title="My Points">
        <PointsCards summary={{ ...summary, points: displayPoints }} />
      </LoyaltySection>

      {/* ── MY LEVELS ── */}
      {summary.tier && (
        <LoyaltySection title="My Levels">
          <LevelProgress
            tier={summary.tier}
            nextTier={summary.nextTier}
            points={summary.earnedPoints}
            pointsLabel={summary.pointsLabel}
          />
        </LoyaltySection>
      )}

      {/* ── REFERRAL LINK ── */}
      {summary.referral?.url && (
        <LoyaltySection title="Referral Link" className="-mt-[13px]">
          <ReferralLink url={summary.referral.url} />
        </LoyaltySection>
      )}

      {/* ── MY REWARDS ── */}
      <LoyaltySection title="My Rewards">
        <RewardTabs active={activeTab} onChange={setActiveTab} />

        {/* Tab: Rewards — catalogue items the shopper can spend points on */}
        {activeTab === "Rewards" && (
          <>
            {catalogRewards.length === 0 ? (
              <div className="mb-[35px] mt-[27px]">
                <RewardsEmpty />
              </div>
            ) : (
              <div className="mt-6 grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {catalogRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    disabled={redeemingId !== null}
                    isWorking={redeemingId === reward.id}
                    onRedeem={handleRedeem}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "Coupons" && (
          <CouponsPanel
            kind="active"
            first={activeCoupons}
          />
        )}

        {activeTab === "Used & Expired Coupons" && (
          <CouponsPanel
            kind="expired"
            first={expiredCoupons}
          />
        )}
      </LoyaltySection>

      {/* ── RECENT ACTIVITIES ── */}
      <ActivitiesSection first={history} />

      {/* ── WAYS TO EARN REWARDS ── */}
      {summary.waysToEarn.length > 0 && (
        <LoyaltySection title="Ways to Earn Rewards">
          <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
            {summary.waysToEarn.map((way) => (
              <WaysToEarnCard
                key={way.id}
                way={way}
                onSetBirthday={setBirthdayFor}
                birthday={birthday}
                birthdayEditable={summary.settings.birthdayEditable}
              />
            ))}
          </div>
        </LoyaltySection>
      )}

      {/* ── NOTIFICATION PREFERENCE ── */}
      <LoyaltySection title="Notification Preference" className="-mt-[7px]">
        <NotificationOptIn checked={emailOptIn} onChange={toggleEmailOptIn} />
      </LoyaltySection>

      {birthdayFor !== null && (
        <BirthdayDialog
          campaignId={birthdayFor}
          onClose={() => setBirthdayFor(null)}
          onSaved={handleBirthdaySaved}
        />
      )}
    </div>
  );
}
