// src/components/layout/search/SearchModal.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchResults from "@/components/layout/search/SearchResults";
import { CloseIcon, SearchIcon } from "@/components/layout/HeaderIcons";
import { useProductSearch } from "@/hooks/useProductSearch";

interface Props {
  onClose: () => void;
}

// Fade time in ms — must match the duration-200 class below
const FADE_MS = 200;

export default function SearchModal({ onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [query, setQuery] = useState("");
  // False on the first paint, then true: that flip is what makes the box fade in
  const [isShown, setIsShown] = useState(false);
  const search = useProductSearch(query);

  // Put the cursor in the box straight away, like the old site
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fade out first, and only remove the box once the fade has finished
  const onCloseSmoothly = useCallback(() => {
    setIsShown(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(onClose, FADE_MS);
  }, [onClose]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Page behind must not scroll while the box is open; Escape closes it
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseSmoothly();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onCloseSmoothly]);

  // Enter opens the best match, so the keyboard alone is enough
  const openFirstProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const first = search.data.products[0];
    if (!first) return;
    router.push(`/product/${first.slug}`);
    onCloseSmoothly();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      // Clicking the dark area closes the box; clicks inside are stopped below
      onClick={onCloseSmoothly}
      className={`fixed inset-0 z-60 bg-black/80 px-4 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
        isShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        // Slides up a few pixels while fading in, so it feels soft and not sudden
        className={`relative mx-auto mt-[22vh] w-full max-w-[600px] transition-transform duration-200 ease-out motion-reduce:transition-none md:mt-[35vh] ${
          isShown ? "translate-y-0" : "translate-y-3"
        }`}
      >
        <button
          type="button"
          onClick={onCloseSmoothly}
          aria-label="Close search"
          className="absolute -top-8 right-0 size-5 cursor-pointer text-white transition-opacity hover:opacity-70"
        >
          <CloseIcon />
        </button>

        <form
          onSubmit={openFirstProduct}
          role="search"
          className="flex h-[54px] items-center gap-3 rounded-pill bg-cream px-6"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-ink-dark outline-none placeholder:text-placeholder"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="size-4 shrink-0 cursor-pointer text-muted-alt hover:text-ink-dark"
            >
              <CloseIcon />
            </button>
          )}
          <button type="submit" aria-label="Search" className="shrink-0 cursor-pointer">
            <SearchIcon />
          </button>
        </form>

        {/* Results hang just under the pill, like the screenshot */}
        <div className="mx-auto mt-px w-full">
          <SearchResults state={search} query={query} onNavigate={onCloseSmoothly} />
        </div>
      </div>
    </div>
  );
}
