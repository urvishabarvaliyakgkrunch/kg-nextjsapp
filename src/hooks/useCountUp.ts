// src/hooks/useCountUp.ts
"use client";

import { useEffect, useRef, useState } from "react";

// Counts from 0 to target once the element scrolls into view, matching the live purity counter
export function useCountUp<T extends HTMLElement>(target: number, durationMs = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<T>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - (1 - t) ** 3;
          setValue(Number((target * eased).toFixed(2)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { ref, value };
}
