// src/components/ui/RouteProgress.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// A page can arrive in 50ms — hold the bar a bit so the click never feels ignored
const MIN_VISIBLE_MS = 600;

// Safety net: if the next page never arrives, do not run the bar forever
const MAX_VISIBLE_MS = 10000;

// Thin blue bar on the bottom edge of the sticky header while the next route loads
export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const startedAt = useRef(0);

  // One listener for the whole site, so no link has to opt in
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Middle-click and ctrl/cmd-click open a new tab — this tab stays put
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("/")) return; // outside links leave the site anyway
      if (link.pathname === window.location.pathname) return; // same page, no wait

      startedAt.current = Date.now();
      setActive(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // A new pathname means the page is on screen — finish the bar
  useEffect(() => {
    if (!active) return;
    const shown = Date.now() - startedAt.current;
    const timer = setTimeout(
      () => setActive(false),
      Math.max(MIN_VISIBLE_MS - shown, 0)
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setActive(false), MAX_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 z-20 h-[3px] overflow-hidden bg-blue-bg"
    >
      {/* data-skeleton leaves reduced-motion users with a plain blue line */}
      <span
        data-skeleton
        className="block h-full w-1/3 animate-route-progress bg-blue"
      />
    </div>
  );
}
