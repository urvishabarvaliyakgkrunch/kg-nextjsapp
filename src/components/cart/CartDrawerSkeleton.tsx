// src/components/cart/CartDrawerSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

const PLACEHOLDER_ROWS = [0, 1];

// Stops the drawer flashing "Your cart is empty" before localStorage is read
export default function CartDrawerSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your cart"
      className="flex flex-1 flex-col"
    >
      {/* Free shipping bar */}
      <Skeleton className="h-[52px] w-full rounded-chip" />

      <div className="pb-5 pt-5">
        {PLACEHOLDER_ROWS.map((row) => (
          <div key={row} className="flex items-start gap-5 px-2.5 py-3">
            <Skeleton className="h-[67px] w-[50px] shrink-0" />

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-[80%] rounded-chip" />
              <Skeleton className="h-3 w-20 rounded-chip" />
              <Skeleton className="h-5 w-24 rounded-chip" />
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal strip */}
      <Skeleton className="h-10 w-full rounded-chip" />
    </div>
  );
}
