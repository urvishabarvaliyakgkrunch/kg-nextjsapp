// src/components/coas/CoasPageSkeleton.tsx

import SampleCoaCardSkeleton from "@/components/coas/SampleCoaCardSkeleton";
import Skeleton from "@/components/ui/Skeleton";

const STEP_COUNT = 5;
const SAMPLE_COUNT = 4;

function HeadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 p-[10px]">
      <Skeleton className="h-3 w-28 rounded-sm" />
      <Skeleton className="h-10 w-3/4 max-w-[560px] rounded-sm min-[1025px]:h-14" />
      <Skeleton className="h-4 w-2/3 max-w-[520px] rounded-sm" />
    </div>
  );
}

// Mirrors the COAs page: hero, five test steps, lot search, sample cards
export default function CoasPageSkeleton() {
  return (
    <div role="status" aria-label="Loading COAs">
      <section className="border-b border-hero-border bg-white px-[10px] py-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 p-[10px]">
          <Skeleton className="h-9 w-64 rounded-full" />
          <Skeleton className="h-12 w-4/5 max-w-[760px] rounded-sm min-[1025px]:h-[146px]" />
          <Skeleton className="h-12 w-3/4 max-w-[600px] rounded-sm" />
          <Skeleton className="h-[104px] w-full rounded-[12px] min-[768px]:w-[450px] min-[1025px]:w-1/2" />
        </div>
      </section>

      <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-5 min-[768px]:py-10 min-[1025px]:py-[60px]">
          <HeadingSkeleton />
          <div className="grid grid-cols-1 gap-[15px] rounded-[12px] border border-hero-border p-[15px] min-[768px]:grid-cols-3 min-[1025px]:grid-cols-5">
            {Array.from({ length: STEP_COUNT }, (_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="h-3 w-6 rounded-sm" />
                <Skeleton className="h-5 w-28 rounded-sm" />
                <Skeleton className="h-16 w-full rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 pb-[30px]">
          <HeadingSkeleton />
          <Skeleton className="mx-auto h-[66px] w-full max-w-[590px] rounded-[8px]" />
          <HeadingSkeleton />
          <ul className="grid grid-cols-1 gap-x-[30px] gap-y-[10px] px-[10px] min-[1025px]:grid-cols-2">
            {Array.from({ length: SAMPLE_COUNT }, (_, i) => (
              <SampleCoaCardSkeleton key={i} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
