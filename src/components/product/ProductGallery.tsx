// src/components/product/ProductGallery.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import type { WPImage } from "@/types/product";

const ZOOM = 2.4;
const GALLERY_SIZES = "(max-width: 1024px) 100vw, 50vw";

interface Props {
  images: WPImage[];
  productName: string;
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={dir === "prev" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

export default function ProductGallery({ images, productName }: Props) {
  const [index, setIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  // Warm the browser cache for the other gallery images once the page is idle,
  // so the arrows swap instantly instead of fetching on click
  useEffect(() => {
    const warm = () =>
      images.slice(1).forEach((img) => {
        // Same srcset/sizes as the visible <Image>, so the browser caches the optimized file it will use
        const { props } = getImageProps({
          src: img.sourceUrl,
          alt: "",
          width: 850,
          height: 850,
          sizes: GALLERY_SIZES,
        });
        const el = new window.Image();
        el.sizes = GALLERY_SIZES;
        if (props.srcSet) el.srcset = props.srcSet;
        el.src = props.src;
      });
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 1500);
    return () => clearTimeout(t);
  }, [images]);

  if (images.length === 0) return null;

  const step = (delta: number) => {
    setZooming(false);
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  // Track the cursor so the magnified area follows it, like the WooCommerce gallery zoom
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const current = images[index];

  return (
    <div className="px-4 md:px-0 lg:sticky lg:top-24">
      <div className="relative flex h-[320px] min-h-0 items-center justify-center overflow-hidden rounded-[16px] border border-line bg-white p-[20px] md:h-[520px] lg:h-[600px]">
        <div
          ref={frameRef}
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMove}
          className="flex h-full w-full cursor-zoom-in items-center justify-center"
        >
          <Image
            key={current.sourceUrl}
            src={current.sourceUrl}
            alt={current.altText || productName}
            width={850}
            height={850}
            priority
            sizes={GALLERY_SIZES}
            className="h-full w-full object-contain transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: zooming ? `scale(${ZOOM})` : "scale(1)",
              transformOrigin: origin,
            }}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-dark shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-colors hover:border-bundle hover:text-bundle"
            >
              <Arrow dir="prev" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-dark shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-colors hover:border-bundle hover:text-bundle"
            >
              <Arrow dir="next" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
