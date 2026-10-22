// src/components/loyalty/RewardsEmpty.tsx

import RewardIcon from "./RewardIcon";

// Shown on the Rewards tab when the balance does not reach any reward yet. The live widget
// puts the same invitation here instead of an empty box: 50px icon, 16px bold title, 14px line.
export default function RewardsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <span className="text-ink-dark">
        <RewardIcon size={50} />
      </span>
      <p className="mt-1 font-sans text-[16px] font-bold leading-[normal] text-[#1D2327]">
        Begin Your Rewards Journey!
      </p>
      <p className="mt-1 font-sans text-[14px] leading-[normal] text-[#1D2327]">
        Shop more and unlock amazing rewards! Discover all the opportunities below!
      </p>
    </div>
  );
}
