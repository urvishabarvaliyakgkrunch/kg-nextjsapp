// src/components/loyalty/ReferralLink.tsx
"use client";

import { useState } from "react";

interface Props {
  url: string;
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 5H6a2 2 0 0 0-2 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// The shopper's own invite link. WordPress builds the URL, so the code and the host both
// stay correct — this only puts it on the clipboard.
export default function ReferralLink({ url }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some browsers — the field stays selectable by hand
    }
  }

  return (
    <div className="flex items-stretch rounded-[4px] border border-line bg-white">
      <input
        readOnly
        value={url}
        aria-label="Your referral link"
        onFocus={(event) => event.currentTarget.select()}
        className="min-w-0 flex-1 bg-transparent px-[14px] py-[8px] font-sans text-[16px] leading-[22px] text-muted-alt outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-1 rounded-r-[4px] bg-ink-dark px-4 py-[10px] font-sans text-[14px] text-white transition-colors hover:bg-black"
      >
        <CopyIcon />
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
