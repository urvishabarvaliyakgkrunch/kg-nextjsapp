// src/components/cart/CartPageSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";
import CartSummarySkeleton from "./CartSummarySkeleton";

// Two rows is enough of a hint — most carts hold one or two lines
const PLACEHOLDER_ROWS = [0, 1];

// Same column widths as CartPageItem, so the real row slots straight in
function RowSkeleton() {
  return (
    <div className="grid grid-cols-[22px_53px_minmax(0,1fr)] items-center gap-y-4 border-b border-row-line py-6 md:grid-cols-[22px_53px_minmax(0,1fr)_72px_137px_88px]">
      <Skeleton className="h-3 w-3 rounded-chip" />
      <Skeleton className="h-10 w-10 rounded-chip" />
      <Skeleton className="h-3 w-[70%] max-w-[220px] rounded-chip" />

      {/* Mobile keeps price · stepper · total on one row, same as the real item */}
      <div className="col-span-3 flex items-center justify-between gap-4 md:contents">
        <Skeleton className="h-3 w-14 rounded-chip" />
        <Skeleton className="h-9 w-[110px] rounded-chip" />
        <Skeleton className="h-3 w-16 rounded-chip" />
      </div>
    </div>
  );
}

// Grey copy of the whole cart layout — shown until the browser has read the saved cart
export default function CartPageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your cart"
      className="mx-auto grid max-w-[1124px] gap-[30px] lg:grid-cols-[minmax(0,1fr)_431px] lg:items-start"
    >
      <div className="flex flex-col gap-[6px]">
        {/* Loyalty banner */}
        <div className="flex items-center gap-4 rounded-chip border border-loyalty-line px-6 py-3">
          <Skeleton className="h-[30px] w-[30px] shrink-0 rounded-full" />
          <Skeleton className="h-3 w-[60%] max-w-[300px] rounded-chip" />
        </div>

        {/* Items card */}
        <div className="rounded-chip border border-cart-line bg-white px-7 pt-5 pb-3">
          <div className="hidden grid-cols-[22px_53px_minmax(0,1fr)_72px_137px_88px] pb-1 md:grid">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <Skeleton className="h-3 w-16 rounded-chip" />
            <Skeleton className="h-3 w-10 rounded-chip" />
            <Skeleton className="h-3 w-16 rounded-chip" />
            <Skeleton className="h-3 w-14 rounded-chip" />
          </div>

          {PLACEHOLDER_ROWS.map((row) => (
            <RowSkeleton key={row} />
          ))}

          <div className="pt-3">
            <Skeleton className="h-[46px] w-[150px] rounded-chip" />
          </div>
        </div>

        {/* Coupon box */}
        <div className="mt-6 rounded-chip border border-cart-line bg-white px-7 py-[19px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-11 flex-1 rounded-chip" />
            <Skeleton className="h-11 w-full rounded-chip sm:w-[191px]" />
          </div>
        </div>
      </div>

      <CartSummarySkeleton />
    </div>
  );
}
