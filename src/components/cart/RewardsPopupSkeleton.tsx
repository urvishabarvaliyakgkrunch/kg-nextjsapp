// src/components/cart/RewardsPopupSkeleton.tsx
import Skeleton from "@/components/ui/Skeleton";

// Same shape as RewardsPopupBody: three stat cards, tab row, then two coupon rows
export default function RewardsPopupSkeleton() {
  return (
    <div role="status" aria-label="Loading your rewards" className="space-y-9 md:space-y-[46px]">
      <div>
        <Skeleton className="mb-6 h-6 w-32" />
        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <Skeleton key={card} className="h-[150px] rounded-[6px]" />
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-6 h-6 w-36" />
        <Skeleton className="mb-6 h-10 w-52" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[108px] rounded-[4px]" />
          <Skeleton className="h-[108px] rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}
