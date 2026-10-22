// src/components/cart/FreeShippingBar.tsx
"use client";

import { formatPrice } from "@/lib/formatPrice";
import { freeShippingProgress } from "@/lib/cartRules";

interface Props {
  subtotal: number;
  minimum: number;
}

export default function FreeShippingBar({ subtotal, minimum }: Props) {
  const { qualified, remaining, percent } = freeShippingProgress(subtotal, minimum);

  // Unlocked turns the whole panel green — same as the live drawer
  const panel = qualified
    ? "border border-ship-ok-line bg-ship-ok-bg"
    : "bg-ship-bg";

  return (
    <div className={`${panel} mb-3 rounded-card px-4 py-[14px]`}>
      <p className="mb-2 flex items-center justify-center gap-1 text-[12px] text-ink-dark">
        {qualified ? (
          <span>
            <b className="font-bold text-ship-ok">
              You&rsquo;ve unlocked free shipping.
            </b>{" "}
            Nice.
          </span>
        ) : (
          <span>
            You&rsquo;re <strong>{formatPrice(remaining)}</strong> away from free
            shipping 🚚
          </span>
        )}
        {qualified && (
          <span className="text-[16px] font-extrabold text-ship-ok">&#10003;</span>
        )}
      </p>

      <div
        className="h-1 w-full overflow-hidden rounded-pill bg-ship-track"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress to free shipping"
      >
        <div
          className={`h-full rounded-pill transition-[width] duration-300 ${
            qualified ? "bg-ship-ok-bar" : "bg-blue"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
