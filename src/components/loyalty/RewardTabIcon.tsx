// src/components/loyalty/RewardTabIcon.tsx
import RewardIcon from "./RewardIcon";

// Small icon in front of the "Rewards" / "Coupons" tab labels, like the live widget
export default function RewardTabIcon({ tab }: { tab: "Rewards" | "Coupons" }) {
  if (tab === "Rewards") {
    return (
      <span className="inline-flex h-[18px] w-[18px] items-center text-current">
        <RewardIcon />
      </span>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 10h22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
