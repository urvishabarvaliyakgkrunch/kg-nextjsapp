// src/components/cart/CartPageItem.tsx
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

export default function CartPageItem({ item }: Props) {
  const removeItem = useCart((s) => s.removeItem);
  const addNotice = useNotices((s) => s.addNotice);
  const lineTotal = item.price * item.quantity;

  const drop = () => {
    removeItem(item.variationId);
    addNotice("Item removed.");
  };

  return (
    // Column widths measured on the live cart: remove · thumb · name · price · qty · subtotal
    <div className="grid grid-cols-[20px_73px_minmax(0,1fr)] items-center gap-y-4 py-5 xl:grid-cols-[20px_73px_minmax(0,1fr)_79px_142px_88px]">
      <button
        type="button"
        onClick={drop}
        className="justify-self-start font-mono text-[18.9px] font-bold leading-none text-ink-dark transition-colors hover:text-blue"
        aria-label={`Remove ${item.name}`}
      >
        &times;
      </button>

      <div className="flex items-center h-[73px] w-[55px] justify-start overflow-hidden">
        {item.image ? (
          <Link href={item.slug ? `/product/${item.slug}` : "/shop"}>
            <Image
              src={item.image}
              alt={item.name}
              width={55}
              height={73}
              className="h-full object-contain"
              unoptimized
            />
          </Link>
        ) : (
          <div className="h-full w-full bg-gray-light" aria-hidden="true" />
        )}
      </div>

      <Link
        href={item.slug ? `/product/${item.slug}` : "/shop"}
        className="pr-5 font-mono text-[12.6px] leading-[18.9px] text-blue transition-colors hover:text-ink-dark"
      >
        {item.name}
      </Link>

      {/* Mobile puts price · stepper · line total on their own row under the name */}
      <div className="col-span-3 flex xl:items-center items-start flex-col xl:flex-row xl:justify-between justify-start gap-4 xl:contents">
        <span className="font-mono text-[14px] text-ink-dark order-2 xl:order-0 flex items-center gap-2">
          <span className="xl:hidden block">Price:</span>
          {formatPrice(item.price)}
        </span>

        <CartStepper item={item} mode="quantity" />

        <span className="font-mono text-[14px] text-ink-dark order-2 xl:order-1 flex items-center gap-2">
          <span className="xl:hidden block">Sub total:</span>
          {formatPrice(lineTotal)}
        </span>
      </div>
    </div>
  );
}
