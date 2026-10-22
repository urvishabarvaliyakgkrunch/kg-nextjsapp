// src/components/loyalty/WaysToEarnCard.tsx

import { formatBirthday } from "@/lib/birthday";
import {
  GLYPH_ACHIEVEMENT,
  GLYPH_BIRTHDAY,
  GLYPH_CALENDAR,
  GLYPH_PURCHASE,
  GLYPH_REFERRAL,
  GLYPH_REVIEW,
  GLYPH_SIGNUP,
} from "@/lib/loyaltyGlyphs";
import type { LoyaltyWayToEarn } from "@/types/loyalty";

// Icon per campaign type, mapped by actionType from WPLoyalty; level bonuses are the default
function glyphFor(type: string): string {
  if (type === "points_for_purchase" || type === "purchase") return GLYPH_PURCHASE;
  if (type === "referral" || type === "refer_a_friend") return GLYPH_REFERRAL;
  if (type === "signup" || type === "sign_up") return GLYPH_SIGNUP;
  if (type === "review" || type === "product_review") return GLYPH_REVIEW;
  if (type === "birthday") return GLYPH_BIRTHDAY;
  return GLYPH_ACHIEVEMENT;
}

function Glyph({ path, size }: { path: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
      <path transform="translate(0 960) scale(1 -1)" d={path} />
    </svg>
  );
}

interface Props {
  way: LoyaltyWayToEarn;
  // Birthday card opens the date popup; once a date is saved it shows that date instead
  onSetBirthday?: (campaignId: number) => void;
  birthday?: string;
  birthdayEditable?: boolean;
}

const DATE_LABEL = "flex shrink-0 items-center gap-[3px] font-sans text-[12px] font-bold text-[#111]";

export default function WaysToEarnCard({ way, onSetBirthday, birthday, birthdayEditable = true }: Props) {
  const isBirthday = way.actionType === "birthday";

  return (
    <div className="rounded-[8px] border border-line bg-white px-3 pb-[20px] pt-[28px]">
      {/* The live card sets the icon on a small white tile with a soft shadow */}
      <span className="mb-4 flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-white text-ink-dark shadow-[0_4px_20px_rgba(10,19,65,0.08)]">
 
        <Glyph path={glyphFor(way.actionType)} size={22} />
      </span>

      {/* Name on the left, the birthday date sits opposite it on the same line */}
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-[4px] font-sans text-[16px] font-semibold leading-5 text-[#1D2327]">
            {way.name}
          </p>

          {/* Description may carry a <br> tag — WPLoyalty uses it for referral two-liner */}
          <p
            className="font-sans text-[13px] font-bold leading-5 text-[#1D2327]"
            // Only the <br> tag ever comes through here, so this is safe
            dangerouslySetInnerHTML={{ __html: way.description }}
          />
        </div>

        {/* wp-admin can lock the date after it is saved — then it is only text */}
        {isBirthday && birthday && !birthdayEditable && (
          <span className={DATE_LABEL}>{formatBirthday(birthday)}</span>
        )}

        {isBirthday && onSetBirthday && (birthdayEditable || !birthday) && (
          <button type="button" onClick={() => onSetBirthday(way.id)} className={DATE_LABEL}>
            <Glyph path={GLYPH_CALENDAR} size={14} />
            {birthday ? formatBirthday(birthday) : "Set Birthday"}
          </button>
        )}
      </div>
    </div>
  );
}
