// src/components/account/AccountSkeletons.tsx

import Skeleton from "@/components/ui/Skeleton";

// The dashboard note box
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border border-line px-7 py-6">
      <Skeleton className="h-4 w-[240px]" />
      <Skeleton className="h-4 w-full max-w-[620px]" />
      <Skeleton className="h-4 w-full max-w-[480px]" />
    </div>
  );
}

// Orders and Downloads both show a table with a heading row
export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="border border-line">
      <div className="flex gap-6 border-b border-line bg-hero-surface px-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b border-line px-4 py-4 last:border-b-0">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

// Two address columns side by side
export function AddressesSkeleton() {
  return (
    <>
      <Skeleton className="mb-10 h-4 w-[380px] max-w-full" />
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-5">
            <Skeleton className="h-8 w-[260px] max-w-full" />
            <div className="flex flex-col gap-3 border border-line px-6 py-5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Account details and the address editor are both bordered form cards
export function FormCardSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[ 830px] flex-col gap-6 border border-line p-8">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-[46px] w-full" />
        </div>
      ))}
      <Skeleton className="h-[46px] w-[180px]" />
    </div>
  );
}

// One order's items, totals and the two address blocks
export function OrderDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-[420px] max-w-full" />
      <div className="flex flex-col gap-3 border border-line p-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-14" />
            <Skeleton className="h-4 flex-1 max-w-[320px]" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <TableSkeleton rows={2} />
    </div>
  );
}
