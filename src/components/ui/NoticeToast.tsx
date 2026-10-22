// src/components/ui/NoticeToast.tsx
"use client";

import { useEffect, useState } from "react";
import { useNotices, type Notice } from "@/store/notices";

// Live timings from the WP snippet: the toast slides up over 350ms, stays for
// 3s, then fades out over 400ms before the node is removed from the DOM.
const ENTER_MS = 350;
const VISIBLE_MS = 3000;
const FADE_MS = 400;

type Phase = "enter" | "shown" | "leaving";

function Toast({ notice }: { notice: Notice }) {
  const dismissNotice = useNotices((s) => s.dismissNotice);
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    // Render one tick in the hidden state first, otherwise the browser has
    // nothing to transition from and the toast simply appears. A timer, not
    // requestAnimationFrame: rAF never fires while the tab is not painting,
    // which would leave the toast invisible while its dismiss timer ran on.
    const enter = setTimeout(() => setPhase("shown"), 20);
    const fade = setTimeout(() => setPhase("leaving"), VISIBLE_MS);
    const remove = setTimeout(
      () => dismissNotice(notice.id),
      VISIBLE_MS + FADE_MS
    );

    return () => {
      clearTimeout(enter);
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, [notice.id, dismissNotice]);

  const hidden = phase !== "shown";

  return (
    <div
      className={`rounded-[8px] bg-toast-bg px-5 py-3.5 text-center text-[13px] leading-[18px] text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-[opacity,transform] ease-out motion-reduce:transition-none ${
        hidden ? "translate-y-[30px] opacity-0" : "translate-y-0 opacity-100"
      }`}
      // Entry and exit run at different speeds in the original snippet
      style={{
        transitionDuration: `${phase === "leaving" ? FADE_MS : ENTER_MS}ms`,
      }}
    >
      {notice.message}
    </div>
  );
}

/**
 * Port of the WordPress "NOTICE BAR TOAST" snippet.
 *
 * The snippet re-positioned Woo's `.woocommerce-notices-wrapper` as a fixed
 * bottom-centre toast and removed it after 3s. There is no server-rendered
 * notice wrapper here, so cart actions queue a notice (see `useNotices`) and
 * this renders it with the same geometry and timing.
 */
export default function NoticeToast() {
  // Filter outside the selector: a selector that builds a new array makes
  // zustand see a changed snapshot on every render and loop forever.
  const all = useNotices((s) => s.notices);
  // Success only, matching what the snippet actually let through
  const notices = all.filter((n) => n.type === "success");

  if (notices.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[99999] flex w-full min-w-[260px] max-w-[380px] -translate-x-1/2 flex-col gap-2 px-5"
    >
      {notices.map((notice) => (
        <Toast key={notice.id} notice={notice} />
      ))}
    </div>
  );
}
