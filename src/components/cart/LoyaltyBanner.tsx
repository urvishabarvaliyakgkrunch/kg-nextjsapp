// src/components/cart/LoyaltyBanner.tsx

interface Props {
  message: string;
}

// Shared with RewardsBanner so both green bars use the same star
export function StarIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M10.92 4.83 Q12 1.95 13.08 4.83 L13.49 5.93 Q14.57 8.82 17.64 8.95 L18.82 9 Q21.89 9.14 19.48 11.05 L18.56 11.78 Q16.15 13.7 16.98 16.67 L17.29 17.8 Q18.11 20.76 15.55 19.06 L14.57 18.42 Q12 16.72 9.43 18.42 L8.45 19.06 Q5.89 20.76 6.71 17.8 L7.02 16.67 Q7.85 13.7 5.44 11.78 L4.52 11.05 Q2.11 9.14 5.18 9 L6.36 8.95 Q9.43 8.82 10.51 5.93 Z" fill="currentColor" />
      <path d="M11.22 6.94 Q12 4.86 12.78 6.94 L13.07 7.73 Q13.85 9.81 16.06 9.9 L16.91 9.94 Q19.12 10.04 17.39 11.42 L16.73 11.94 Q14.99 13.32 15.58 15.46 L15.81 16.27 Q16.4 18.41 14.55 17.18 L13.85 16.72 Q12 15.49 10.15 16.72 L9.45 17.18 Q7.6 18.41 8.19 16.27 L8.42 15.46 Q9.01 13.32 7.27 11.94 L6.61 11.42 Q4.88 10.04 7.09 9.94 L7.94 9.9 Q10.15 9.81 10.93 7.73 Z" fill="#fff" />
      <path d="M11.48 8.74 Q12 7.36 12.52 8.74 L12.71 9.27 Q13.23 10.65 14.71 10.72 L15.27 10.74 Q16.75 10.81 15.59 11.73 L15.15 12.08 Q13.99 13 14.39 14.42 L14.54 14.96 Q14.93 16.39 13.7 15.57 L13.23 15.26 Q12 14.45 10.77 15.26 L10.3 15.57 Q9.07 16.39 9.46 14.96 L9.61 14.42 Q10.01 13 8.85 12.08 L8.41 11.73 Q7.25 10.81 8.73 10.74 L9.29 10.72 Q10.77 10.65 11.29 9.27 Z" fill="currentColor" />
    </svg>
  );
}

// Sits above the item table. The sentence and the number both come from WPLoyalty, so there
// is nothing to show when the shopper is signed out or WordPress could not be reached.
export default function LoyaltyBanner({ message }: Props) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-[20px] rounded-[6px] border border-loyalty md:px-[28px] md:py-[5px] px-[15px] py-[8px]">
      <span className="flex-shrink-0 text-loyalty-star">
        <StarIcon />
      </span>
      <p className="font-sans text-[15px] leading-[22.4px] font-semibold text-loyalty">
        {message}{" "}
      </p>
    </div>
  );
}
