// src/components/research/ResearchPageSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

const ARTICLE_COUNT = 4;
const COMPOUND_COUNT = 2;
const STUDY_COUNT = 3;

function HeadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 p-[10px]">
      <Skeleton className="h-3 w-28 rounded-sm" />
      <Skeleton className="h-10 w-3/4 max-w-[560px] rounded-sm min-[1025px]:h-14" />
      <Skeleton className="h-4 w-2/3 max-w-[520px] rounded-sm" />
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-[12px] border border-field-border bg-white p-5">
      <Skeleton className="h-9 w-28 rounded-full" />
      <Skeleton className="h-6 w-4/5 rounded-sm" />
      <Skeleton className="h-12 w-full rounded-sm" />
    </div>
  );
}

function CompoundSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-[12px] border border-field-border p-[15px]">
      <div className="flex items-center justify-between gap-5 border-b border-field-border p-[10px]">
        <Skeleton className="h-7 w-40 rounded-sm" />
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
      {Array.from({ length: STUDY_COUNT }, (_, i) => (
        <div key={i} className="flex flex-col gap-3 p-[10px]">
          <Skeleton className="h-3 w-56 rounded-sm" />
          <Skeleton className="h-5 w-4/5 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

// Mirrors the Research page: hero, article cards, notify bar, literature cards
export default function ResearchPageSkeleton() {
  return (
    <div role="status" aria-label="Loading research">
      <section className="border-b border-hero-border bg-white px-[10px] pt-[30px] pb-[10px] md:py-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 p-[10px]">
          <Skeleton className="h-9 w-64 rounded-full" />
          <Skeleton className="h-12 w-4/5 max-w-[760px] rounded-sm min-[1025px]:h-[146px]" />
          <Skeleton className="h-12 w-3/4 max-w-[600px] rounded-sm" />
        </div>
      </section>

      <section className="bg-hero-surface px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-10 min-[1025px]:pb-[90px] min-[1025px]:pt-[60px]">
          <HeadingSkeleton />
          <div className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-2 min-[1025px]:p-[10px]">
            {Array.from({ length: ARTICLE_COUNT }, (_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
          <Skeleton className="h-[102px] w-full rounded-[12px]" />
        </div>
      </section>

      <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 py-[30px] min-[768px]:py-10 min-[1025px]:py-[60px]">
          <HeadingSkeleton />
          {Array.from({ length: COMPOUND_COUNT }, (_, i) => (
            <CompoundSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
