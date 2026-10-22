// src/components/loyalty/PointsCards.tsx

import { formatPrice } from "@/lib/formatPrice";
import { AvailablePointsIcon, RedeemedPointsIcon, UsedRewardsIcon } from "./PointsIcons";
import type { LoyaltySummary } from "@/types/loyalty";

// Live card: 16/18 label, 22/28 bold figure, 14/18 footnote, 10px 20px 14px padding
const LABEL = "font-sans text-[16px] font-medium leading-[18px] tracking-[0.02em] text-ink";
const VALUE = "font-sans text-[22px] font-bold leading-[28px] text-ink-dark";
const NOTE = "font-sans text-[16px] leading-[18px] text-[#1D2327]";
const CARD = "flex flex-col gap-[10px] rounded-[10px] border border-[#CFCFCF] bg-white px-5 pb-[14px] pt-[10px]";

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  footnote: string;
}

function StatCard({ icon, label, value, footnote }: CardProps) {
  return (
    <div className={CARD}>
      <span className="block text-ink-dark" aria-hidden="true">
        {icon}
      </span>
      <p className={LABEL}>{label}</p>
      <p className={VALUE}>{value}</p>
      <p className={NOTE}>{footnote}</p>
    </div>
  );
}

// The three figures at the top of the live page. Every number is WordPress's — the labels
// follow the point wording the client set in wp-admin ("points" / "point").
export default function PointsCards({
  summary,
  gridClassName = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  summary: LoyaltySummary;
  // The cart popup is narrower than the page, so it picks its own breakpoints
  gridClassName?: string;
}) {
  const { points, pointsLabel, earnedPoints, usedPoints, usedRewards, couponCount } = summary;

  return (
    <div className={`grid gap-[14px] md:gap-[18px] ${gridClassName}`}>
      <StatCard
        icon={<AvailablePointsIcon />}
        label={`Available ${pointsLabel}`}
        value={String(points)}
        footnote={`Total ${pointsLabel} earned: ${earnedPoints}`}
      />
      <StatCard
        icon={<RedeemedPointsIcon />}
        label={`Redeemed ${pointsLabel}`}
        value={String(usedPoints)}
        footnote={
          couponCount > 0
            ? `${pointsLabel.charAt(0).toUpperCase()}${pointsLabel.slice(1)} to Coupons : ${couponCount}`
            : ""
        }
      />
      {/* Third card: used rewards count with currency selector (matches live WPLoyalty widget) */}
      <div className={CARD}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-ink-dark" aria-hidden="true">
            <UsedRewardsIcon />
          </span>
          {/* Currency selector — WPLoyalty supports multi-currency; USD is the default */}
          <select
            aria-label="Currency"
            defaultValue="USD"
            className="rounded-[4px] border border-line bg-white px-[16px] py-[8px] font-sans text-[16px] text-ink outline-none"
          >
            <option value="USD">USD</option>
          </select>
        </div>
        <p className={LABEL}>Used rewards</p>
        <p className={VALUE}>{String(usedRewards.count)}</p>
        <p className={NOTE}>
          rewards value: {usedRewards.value > 0 ? formatPrice(usedRewards.value) : 0}
        </p>
      </div>
    </div>
  );
}
