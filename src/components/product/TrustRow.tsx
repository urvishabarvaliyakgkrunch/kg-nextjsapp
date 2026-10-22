// src/components/product/TrustRow.tsx

import type { ReactNode } from "react";

// Live store: blue outline icons, one row each, ruled above and below
const ICON_PROPS = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ITEMS: { label: string; icon: ReactNode }[] = [
  {
    label: "30-Day Money Back",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    label: "2-Day Shipping",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M2 6h11v10H2z" />
        <path d="M13 9h4l4 4v3h-8" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    label: "Batch COA Details Below",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Secure Checkout",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
];

// coaAnchor: the page has a COA section, so the COA line jumps down to it
export default function TrustRow({ coaAnchor = false }: { coaAnchor?: boolean }) {
  return (
    <ul className="mt-6 grid grid-cols-1 gap-y-5 border-y border-line py-6 md:grid-cols-2 md:gap-x-6">
      {ITEMS.map((item) => {
        const content = (
          <>
            <span className="flex w-7 shrink-0 justify-center text-bundle">{item.icon}</span>
            {item.label}
          </>
        );
        const linked = coaAnchor && item.label === "Batch COA Details Below";
        return (
          <li
            key={item.label}
            className="flex min-h-6 items-center font-mono text-[11.6px] font-medium uppercase text-ink-dark"
          >
            {linked ? (
              <a
                href="#coa"
                className="flex items-center gap-5 underline decoration-bundle/40 underline-offset-4 transition-colors hover:text-bundle"
              >
                {content}
              </a>
            ) : (
              <span className="flex items-center gap-5">{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
