// src/components/cart/CartDrawerItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useNotices } from "@/store/notices";
import { formatPrice } from "@/lib/formatPrice";
import CartStepper from "./CartStepper";
import type { CartItem } from "@/types/cart";

interface Props {
  item: CartItem;
}

export default function CartDrawerItem({ item }: Props) {
  const removeItem = useCart((s) => s.removeItem);
  const addNotice = useNotices((s) => s.addNotice);

  const drop = () => {
    removeItem(item.variationId);
    addNotice("Item removed.");
  };

  const showCompare =
    typeof item.regularPrice === "number" && item.regularPrice > item.price;

  return (
    <div className="flex items-start gap-5 px-2.5 py-3">
      <div className="h-[67px] w-[50px] flex-shrink-0">
        <Link href={`/product/${item.slug}`}>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              width={50}
              height={67}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-gray-light" aria-hidden="true" />
          )}
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/product/${item.slug}`}
          className="font-mono text-[13px] font-medium leading-[17px] text-black"
        >
          {item.name}
        </Link>

        <p className="mt-1 font-mono text-[14px] font-medium leading-[22px] text-ink-dark">
          {formatPrice(item.price)}
          {showCompare && (
            <span className="pl-[5px] text-muted line-through">
              {formatPrice(item.regularPrice as number)}
            </span>
          )}
          {/* Stepper shows the bundle size, so the pack count needs its own hint */}
          {item.quantity > 1 && (
            <span className="pl-[5px] text-muted">&times; {item.quantity}</span>
          )}
        </p>

        <div className="mt-1.5 flex items-center justify-between">
          <CartStepper item={item} mode="tier" look="plain" />
          <button
            type="button"
            onClick={drop}
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-blue text-[12px] leading-none text-muted-alt transition-opacity hover:opacity-70"
            aria-label={`Remove ${item.name}`}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
