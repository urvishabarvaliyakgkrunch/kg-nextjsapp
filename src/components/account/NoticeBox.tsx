// src/components/account/NoticeBox.tsx

// Woo's own "nothing here yet" strip — grey panel with a blue rule on top
export default function NoticeBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-t-[3px] border-blue bg-hero-surface px-6 py-5">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="shrink-0 text-blue"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
      </svg>
      <p className="font-mono text-[14px] text-ink">{children}</p>
    </div>
  );
}
