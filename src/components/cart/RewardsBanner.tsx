// src/components/cart/RewardsBanner.tsx
"use client";

import { useState } from "react";
import RewardsPopup from "./RewardsPopup";
import { StarIcon } from "./LoyaltyBanner";

interface Props {
  // WPLoyalty's "choose your rewards" sentence. Empty for guests, so nothing shows.
  message: string;
  balance: number;
}

// Second green bar under the earn message: opens the rewards popup, like the live cart
export default function RewardsBanner({ message, balance }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!message) return null;

  return (
    <>
      <div className="flex items-center gap-[20px] rounded-[6px] border border-loyalty px-[15px] py-[8px] md:px-[28px] md:py-[5px]">
        <span className="flex-shrink-0 text-loyalty-star">
          <StarIcon />
        </span>
       
        <p className="font-sans text-[15px] leading-[22.4px] font-semibold text-loyalty">
          {
            balance == 0 ? `You have ${balance} points. Keep shopping to earn rewards! ` : message
          }
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer font-semibold text-blue transition-opacity hover:opacity-70"
          >
            Click Here
          </button>
        </p>
      </div>

      {/* Mounted only while open, so the popup data loads on click, not on page load */}
      {isOpen && <RewardsPopup onClose={() => setIsOpen(false)} />}
    </>
  );
}
