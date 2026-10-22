// src/components/loyalty/RewardCard.tsx
"use client";

import RewardIcon from "./RewardIcon";
import type { LoyaltyReward } from "@/types/loyalty";

interface Props {
  reward: LoyaltyReward;
  // False while another card on the page is being redeemed, so nothing is clicked twice
  disabled: boolean;
  isWorking: boolean;
  onRedeem: (reward: LoyaltyReward) => void;
}

// A reward still in the catalogue: the shopper pays points to turn it into a coupon.
export default function RewardCard({
  reward,
  disabled,
  isWorking,
  onRedeem,
}: Props) {
  return (
    <div className="relative flex flex-col rounded-[4px] border border-line bg-white p-5">
      {/* The live card tucks the discount wording into the top-right corner of the border */}
      {reward.discountLabel && (
        <span className="absolute right-0 top-0 border-b border-l border-line bg-white px-3 py-1 font-sans text-[13px] text-muted-alt">
          {reward.discountLabel}
        </span>
      )}

      <span className="mb-3 mt-7 text-ink-dark">
        <RewardIcon />
      </span>

      <p className="font-sans text-[16px] font-semibold text-ink-dark">
        {reward.displayName || reward.name}
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onRedeem(reward)}
        className="mt-8 h-[38px] w-full rounded-[3px] bg-blue font-sans text-[15px] text-white transition-colors hover:bg-blue-alt disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isWorking ? "Redeeming…" : "Redeem Now"}
      </button>
    </div>
  );
}
