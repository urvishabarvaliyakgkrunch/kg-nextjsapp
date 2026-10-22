// src/components/loyalty/LevelProgress.tsx

import type { LoyaltyNextTier, LoyaltyTier } from "@/types/loyalty";

interface Props {
  tier: LoyaltyTier | null;
  nextTier: LoyaltyNextTier | null;
  points: number;
  pointsLabel: string;
}

function BadgeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"  width="40" height="40" x="0" y="0" viewBox="0 0 100 100" ><g><path d="m57.66 24.53-5.42-11a2.5 2.5 0 0 0-4.48 0l-5.42 11-12.12 1.76a2.5 2.5 0 0 0-1.38 4.27l8.76 8.54-2.07 12.07a2.5 2.5 0 0 0 3.63 2.64L50 48.11l10.84 5.7a2.5 2.5 0 0 0 1.16.28 2.52 2.52 0 0 0 1.47-.47 2.49 2.49 0 0 0 1-2.45L62.4 39.1l8.76-8.54a2.5 2.5 0 0 0-1.38-4.27ZM58 36.44a2.51 2.51 0 0 0-.71 2.21L58.68 47l-7.52-4a2.5 2.5 0 0 0-2.32 0l-7.52 4 1.43-8.37a2.51 2.51 0 0 0-.75-2.19l-6-5.93 8.41-1.22a2.5 2.5 0 0 0 1.88-1.37L50 20.31l3.76 7.61a2.5 2.5 0 0 0 1.88 1.37l8.41 1.22ZM50 2.5a33.73 33.73 0 0 0-22.5 58.88V92.5a2.49 2.49 0 0 0 1.29 2.19 2.54 2.54 0 0 0 2.54-.07L50 83l18.67 11.62A2.56 2.56 0 0 0 70 95a2.49 2.49 0 0 0 2.5-2.5V61.38A33.73 33.73 0 0 0 50 2.5M67.5 88 51.33 77.88a2.5 2.5 0 0 0-2.66 0L32.5 88V65.1a33.7 33.7 0 0 0 35 0ZM50 65a28.75 28.75 0 1 1 28.75-28.75A28.79 28.79 0 0 1 50 65" data-name="Layer 2" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>
  );
}

function TickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path d="m7 12.5 3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The level bar. The two end numbers are the tier boundaries WordPress holds, and the
// sentence in the middle is the gap it already worked out — nothing is counted here.
export default function LevelProgress({
  tier,
  nextTier,
  points,
  pointsLabel,
}: Props) {
  if (!tier) return null;

  const start = tier.fromPoints;
  const end = nextTier ? nextTier.fromPoints : tier.toPoints || points;
  const span = Math.max(1, end - start);
  // Clamped so a top-tier shopper fills the bar instead of overflowing it
  const filled = Math.min(100, Math.max(0, ((points - start) / span) * 100));

  return (
    <div className="flex flex-col gap-[10px] rounded-[8px] border border-line bg-white">
      {/* Current level on the left, next level on the right, split off by its own rule */}
      <div className="flex items-start justify-between gap-4 px-5 pt-6">
        <div className="flex items-start gap-3">
          <span className="mt-[5px] text-ink-dark">
            <BadgeIcon />
          </span>
          <span>
            <span className="block font-sans text-[16px] font-bold text-ink-dark">
              {tier.name}
            </span>
            <span className="block font-sans text-[16px] text-muted-alt">
              Current level
            </span>
          </span>
        </div>

        {nextTier && (
          <div className=" ">
            <span className="block font-sans text-[16px] font-bold text-ink-dark opacity-60">
              {nextTier.name}
            </span>
            <span className="block font-sans text-[16px] text-muted-alt">Next level</span>
          </div>
        )}
      </div>

      <div className="border-t border-line px-5 py-6">
        {nextTier && (
          <p className="mb-3 text-center font-sans text-[16px] text-ink">
            {nextTier.pointsNeeded} {pointsLabel} more needed to unlock next level
          </p>
        )}

        <div className="flex items-center gap-3">
          <span className="shrink-0 text-ink-dark">
            <TickIcon />
          </span>
          <div
            className="h-[6px] flex-1 rounded-full bg-gray-light"
            role="progressbar"
            aria-valuemin={start}
            aria-valuemax={end}
            aria-valuenow={points}
            aria-label={`${tier.name} progress`}
          >
            <div
              className="h-full rounded-full bg-ink-dark"
              style={{ width: `${filled}%` }}
            />
          </div>
          <span
            aria-hidden="true"
            className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-ink-dark"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-white" />
          </span>
        </div>

        <div className="mt-2 flex justify-between font-sans text-[16px] font-bold text-ink-dark">
          <span>{start}</span>
          <span>{end}</span>
        </div>
      </div>
    </div>
  );
}
