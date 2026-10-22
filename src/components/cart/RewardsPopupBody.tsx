// src/components/cart/RewardsPopupBody.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import LoyaltySection from "@/components/loyalty/LoyaltySection";
import PointsCards from "@/components/loyalty/PointsCards";
import RewardCard from "@/components/loyalty/RewardCard";
import RewardTabs, { type RewardTab } from "@/components/loyalty/RewardTabs";
import RewardsEmpty from "@/components/loyalty/RewardsEmpty";
import CouponsEmpty from "@/components/loyalty/CouponsEmpty";
import CouponCard from "@/components/loyalty/CouponCard";
import type { LoyaltyReward, LoyaltyRewardsPopup } from "@/types/loyalty";

// The live popup shows only these two tabs (no "Used & Expired")
const TABS: readonly RewardTab[] = ["Rewards", "Coupons"];

interface Props {
  data: LoyaltyRewardsPopup;
  // Asks the popup to fetch fresh data after a redeem
  onChanged: () => void;
}

export default function RewardsPopupBody({ data, onChanged }: Props) {
  const addCoupon = useCart((s) => s.addCoupon);
  const [tab, setTab] = useState<RewardTab>("Rewards");
  // One redeem at a time, so a double click cannot spend points twice
  const [redeemingId, setRedeemingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const catalog = data.summary.rewards.filter((r) => r.rewardTable === "reward");
  const coupons = data.coupons?.items ?? [];

  // The cart prices the code on its own: a rejected code is dropped and Woo says why
  function applyToCart(code: string) {
    addCoupon(code);
  }

  async function redeem(reward: LoyaltyReward) {
    setRedeemingId(reward.id);
    setError("");
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
      if (!res.ok) throw new Error("Redeem failed");
      // The new coupon now exists in WordPress — show it on the Coupons tab
      onChanged();
      setTab("Coupons");
    } catch {
      setError("Could not redeem this reward. Please try again.");
    } finally {
      setRedeemingId(null);
    }
  }

  return (
    <div className="space-y-9 md:space-y-[46px]">
      <LoyaltySection title="My Points" compact>
        <PointsCards summary={data.summary} gridClassName="md:grid-cols-3" />
      </LoyaltySection>

      <LoyaltySection title="My Rewards" compact>
        <RewardTabs tabs={TABS} active={tab} onChange={setTab} />

        <div className="mt-6" />

        {error && (
          <p role="alert" className="mb-4 font-sans text-[14px] text-danger">
            {error}
          </p>
        )}

        {tab === "Rewards" &&
          (catalog.length === 0 ? (
            <RewardsEmpty />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  disabled={redeemingId !== null}
                  isWorking={redeemingId === reward.id}
                  onRedeem={redeem}
                />
              ))}
            </div>
          ))}

        {tab === "Coupons" &&
          (coupons.length === 0 ? (
            <CouponsEmpty />
          ) : (
            <div className="flex flex-col gap-4">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} onApply={applyToCart} />
              ))}
            </div>
          ))}
      </LoyaltySection>
    </div>
  );
}
