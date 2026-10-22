// src/components/cart/RewardsPopup.tsx
"use client";

import { useEffect } from "react";
import { useRewardsPopup } from "@/hooks/useRewardsPopup";
import RewardsPopupBody from "./RewardsPopupBody";
import RewardsPopupSkeleton from "./RewardsPopupSkeleton";

interface Props {
  onClose: () => void;
}

// The white window over the cart: it never grows past the screen, only its middle scrolls
export default function RewardsPopup({ onClose }: Props) {
  const { data, status, reload } = useRewardsPopup();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    // Stop the cart behind the popup from scrolling while it is open
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    // Clicking the dark area closes the popup, clicking inside it does not
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="My points and rewards"
        // Capped to the screen height so the Ok button is always visible
        className="relative flex max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-40px)] w-full max-w-[980px] flex-col bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center text-[22px] md:right-6 md:top-5 leading-none text-muted-alt transition-opacity hover:opacity-70"
        >
          &times;
        </button>

        {/* Only this middle part scrolls */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-14 sm:px-8 md:px-[64px] md:pt-[72px]">
          {status === "loading" && !data && <RewardsPopupSkeleton />}

          {status === "error" && !data && (
            <p role="alert" className="py-10 text-center font-sans text-[16px] text-muted">
              Your rewards are not available right now. Please try again in a moment.
            </p>
          )}

          {data && <RewardsPopupBody data={data} onChanged={reload} />}
        </div>

        <div className="flex shrink-0 justify-end px-4 py-4 md:px-2 md:pb-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-danger bg-dark px-8 py-3 font-sans text-[15px] text-white transition-opacity hover:opacity-80"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
