// src/components/cart/CartStepper.tsx
"use client";

import { useCart } from "@/store/cart";
import type { CartItem } from "@/types/cart";

interface Props {
  item: CartItem;
  // "quantity" = how many of this pack (cart page). "tier" = swap 1/2/3 Bottles (drawer).
  mode: "quantity" | "tier";
  // "boxed" = joined bordered cells (cart page). "plain" = the rewards-plugin stepper (drawer).
  look?: "boxed" | "plain";
}

export default function CartStepper({ item, mode, look = "boxed" }: Props) {
  const stepTier = useCart((s) => s.stepTier);
  const updateQuantity = useCart((s) => s.updateQuantity);

  const tiers = item.tiers ?? [];
  const index = tiers.findIndex((t) => t.variationId === item.variationId);
  // A simple product has no tiers, so it always falls back to quantity
  const isTier = mode === "tier" && index !== -1 && tiers.length > 1;

  const value = isTier ? tiers[index].label : String(item.quantity);
  // Plugin rule: stop at the smallest and the largest real variation (max 3 bottles)
  const canDecrease = isTier ? index > 0 : item.quantity > 1;
  const canIncrease = isTier
    ? index < tiers.length - 1
    : !item.maxQty || item.quantity < item.maxQty;

  const step = (direction: 1 | -1) => {
    if (isTier) stepTier(item.variationId, direction);
    else updateQuantity(item.variationId, item.quantity + direction);
  };

  const boxed = look === "boxed";

  // "plain" copies .elx-tier-btn from elixser-rewards-custom.php exactly
  const button = boxed
    ? "h-[35px] w-9 font-mono text-[18px] text-ink-dark hover:bg-cream"
    : "h-[26px] w-[26px] rounded-btn border border-tier-line text-[16px] font-semibold text-dark hover:border-blue hover:text-blue";

  return (
    <div
      className={`flex items-center ${
        boxed ? "w-fit overflow-hidden rounded-chip border border-ink-dark" : "gap-2"
      }`}
      role="group"
      aria-label={mode}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={!canDecrease}
        className={`flex items-center justify-center leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-tier-line disabled:hover:text-dark ${button}`}
        aria-label={isTier ? "Fewer bottles" : "Decrease quantity"}
      >
        &minus;
      </button>

      <span
        className={
          boxed
            ? "flex h-[35px] w-[48px] items-center justify-center border-x border-ink-dark font-mono text-[14px] font-semibold whitespace-nowrap text-ink-dark"
            : "min-w-16 text-center font-mono text-[14px] font-semibold whitespace-nowrap text-dark"
        }
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={!canIncrease}
        className={`flex items-center justify-center leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-tier-line disabled:hover:text-dark ${button}`}
        aria-label={isTier ? "More bottles" : "Increase quantity"}
      >
        +
      </button>
    </div>
  );
}
