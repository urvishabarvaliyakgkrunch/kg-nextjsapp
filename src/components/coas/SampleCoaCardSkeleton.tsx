// src/components/coas/SampleCoaCardSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Mirrors SampleCoaCard: same border, margin and padding, so nothing jumps when results land
export default function SampleCoaCardSkeleton() {
  return (
    <li className="my-[10px] flex items-center gap-5 rounded-[12px] border border-field-border p-5">
      <Skeleton className="h-6 w-6 shrink-0 rounded-sm" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-5 w-40 rounded-sm" />
        <Skeleton className="h-3 w-56 rounded-sm" />
      </div>
      <Skeleton className="h-4 w-24 rounded-sm" />
    </li>
  );
}
