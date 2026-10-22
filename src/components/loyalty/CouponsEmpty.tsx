// src/components/loyalty/CouponsEmpty.tsx

// Shown on the Coupons tab when the shopper has no active coupon yet: a tilted ticket over a
// code strip, a bold line, then the invitation. Same sizes as RewardsEmpty (16px bold, 14px).
function TicketIcon() {
  return (
    <svg width="56" height="46" viewBox="0 0 60 48" fill="none" aria-hidden="true">
      {/* Top ticket: solid, tilted, notched ends, dashed stub line and a small star */}
      <g transform="translate(38 14) rotate(-35)">
        <path d="M-16-9H16V-3a3 3 0 0 0 0 6V9H-16V3a3 3 0 0 0 0-6z" fill="currentColor" />
        <path d="M6-7V7" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 1.8" />
        <path d="M-7-4l1.2 2.6 2.6.4-1.9 1.8.5 2.7-2.4-1.3-2.4 1.3.5-2.7-1.9-1.8 2.6-.4z" fill="#fff" />
      </g>
      {/* Bottom ticket: outlined, notched ends, dark strip with three stars */}
      <path
        d="M5 26H45V32a3 3 0 0 0 0 6V44H5V38a3 3 0 0 0 0-6z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <rect x="14" y="30.5" width="22" height="8" rx="1" fill="currentColor" />
      <g fill="#fff">
        <circle cx="19.5" cy="34.5" r="1.3" />
        <circle cx="25" cy="34.5" r="1.3" />
        <circle cx="30.5" cy="34.5" r="1.3" />
      </g>
    </svg>
  );
}

// Used & Expired tab: a clock overlapped by a calendar page showing "11"
function ExpiredIcon() {
  return (
    <svg width="50" height="46" viewBox="0 0 54 48" fill="none" aria-hidden="true">
      <circle cx="21" cy="21" r="16" fill="#fff" stroke="currentColor" strokeWidth="3.2" />
      <path d="M21 10V21L14 25" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21" cy="21" r="1.8" fill="currentColor" />
      {/* Calendar page */}
      <rect x="28" y="26" width="24" height="20" rx="2.5" fill="#fff" stroke="currentColor" strokeWidth="2.6" />
      <path d="M28 26h24v6H28z" fill="currentColor" />
      <path d="M34 23v6M46 23v6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M36 35.5v7M34.5 37l1.5-1.5M43 35.5v7M41.5 37l1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const COPY = {
  active: {
    icon: <TicketIcon />,
    title: "Transform your points into savings! Convert to coupons now.",
    text: "Maximize the value of your earned points by converting them into discount coupons. Make your shopping experience even more rewarding!",
  },
  expired: {
    icon: <ExpiredIcon />,
    title: "Used/Expired Coupons",
    text: "The following are a list of coupons that you've used or got expired.",
  },
};

// Empty state shared by the Coupons and Used & Expired tabs (16px bold title, 14px line)
export default function CouponsEmpty({ kind = "active" }: { kind?: "active" | "expired" }) {
  const { icon, title, text } = COPY[kind];
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <span className="text-[#1D2327]">{icon}</span>
      <p className="mt-1 font-sans text-[16px] font-bold leading-[normal] text-[#1D2327]">{title}</p>
      <p className="mt-1 font-sans text-[14px] leading-[normal] text-[#1D2327]">{text}</p>
    </div>
  );
}
