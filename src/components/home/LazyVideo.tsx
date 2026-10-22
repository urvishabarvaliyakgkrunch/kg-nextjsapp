// src/components/home/LazyVideo.tsx
"use client";

import { useEffect, useRef, useState } from "react";

// Starts downloading the video only when it is close to the screen,
// so it never competes with the first paint of the page.
export default function LazyVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      // Start early, about one screen before it is visible, so it is usually ready on arrival
      { rootMargin: "1000px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#0b2a5b] to-ink-dark object-cover"
      src={active ? src : undefined}
      poster={poster}
      preload="metadata"
      autoPlay
      muted
      playsInline
      loop
      aria-hidden="true"
    >
      <source media="(max-width: 767px)" src={active ? src : undefined} />
    </video>
  );
}
