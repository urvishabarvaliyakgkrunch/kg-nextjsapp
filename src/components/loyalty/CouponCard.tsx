// src/components/loyalty/CouponCard.tsx
"use client";

import { useState } from "react";
import type { LoyaltyReward } from "@/types/loyalty";

interface Props {
  coupon: LoyaltyReward;
  // Used & Expired tab passes true — no "Apply Coupon" button shown
  isExpired?: boolean;
  // The cart popup passes this so the button puts the code on the cart instead of copying it
  onApply?: (code: string) => void;
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 5H6a2 2 0 0 0-2 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Circled tick shown on the copy button for a moment after copying
function CopiedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Dark scalloped "$" badge floating over an open outlined hand
function CouponHandIcon() {
  return (
    <svg width="46" height="38" viewBox="0 0 64 52" fill="none" aria-hidden="true">
      {/* Badge: three rotated rounded squares make the scalloped edge */}
      <g fill="#1D2327">
        <rect x="21" y="3" width="22" height="22" rx="5" />
        <rect x="21" y="3" width="22" height="22" rx="5" transform="rotate(30 32 14)" />
        <rect x="21" y="3" width="22" height="22" rx="5" transform="rotate(60 32 14)" />
      </g>
      <text
        x="32"
        y="20.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="16"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        $
      </text>
      {/* Open hand and cuff */}
      <g stroke="#1D2327" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="30" width="8" height="17" rx="1" />
        <path d="M11 33H19L27 36H38A2.5 2.5 0 0 1 38 41H27" />
        <path d="M11 44H18L28 47H40L53 37A2.5 2.5 0 0 0 49 34L40 39" />
      </g>
    </svg>
  );
}

// A reward the shopper already claimed: shows the coupon code and an apply button
export default function CouponCard({ coupon, isExpired = false, onApply }: Props) {
  const [copied, setCopied] = useState(false);

  // Copy only: never applies the coupon or closes the popup
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the code is visible in the field, copy by hand
    }
  }

  // Inside the cart the shopper wants the discount; elsewhere the button copies the code
  function applyCoupon() {
    if (onApply) onApply(coupon.code);
    else void copyCode();
  }

  return (
    <div className="flex items-center justify-between gap-6 rounded-[10px] border border-[#CFCFCF] bg-white px-5 py-5 max-sm:flex-col max-sm:items-stretch">
      {/* Left: icon, reward name, then the discount wording WordPress sent */}
      <div className="flex items-center gap-4 sm:w-[70%]">
        <span className="shrink-0 text-ink-dark">
          <CouponHandIcon />
        </span>
        <div className="min-w-0">
          <p className="font-sans text-[16px] font-bold leading-[20px] text-ink-dark">
            {coupon.displayName || coupon.name}
          </p>
          {coupon.discountLabel && (
            <p className="font-sans text-[16px] text-ink">{coupon.discountLabel}</p>
          )}
        </div>
      </div>

      {/* Right: the dashed code chip with its copy button, then the apply button */}
      {!isExpired && coupon.code && (
        <div className="shrink-0 sm:w-[237px]">
          <div className="flex items-stretch rounded-[6px] border border-dashed border-coupon-line bg-coupon-bg">
            <input
              readOnly
              value={coupon.code}
              aria-label="Coupon code"
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 bg-transparent px-3 py-[8px] text-center font-sans text-[14px] uppercase tracking-[0.04em] text-coupon-text outline-none"
            />
            <button
              type="button"
              onClick={copyCode}
              aria-label={copied ? "Coupon code copied" : `Copy coupon code ${coupon.code}`}
              className="shrink-0 border-l border-dashed border-coupon-line px-4 text-coupon-text transition-opacity hover:opacity-70"
            >
              {copied ? <CopiedIcon /> : <CopyIcon />}
            </button>
          </div>

          <button
            type="button"
            onClick={applyCoupon}
            className="mt-[8px] h-[35px] w-full rounded-[6px] bg-blue font-sans text-[14px] text-white transition-colors hover:bg-blue-alt"
          >
            Apply Coupon
          </button>
        </div>
      )}

      {isExpired && (
        <span className="shrink-0 font-sans text-[14px] uppercase tracking-[0.04em] text-muted">
          {coupon.code}
        </span>
      )}
    </div>
  );
}
