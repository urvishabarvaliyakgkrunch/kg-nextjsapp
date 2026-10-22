// src/components/contact/ContactPageSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

const CARD_COUNT = 3;

function CardSkeleton() {
  return (
    <li className="flex flex-col gap-5 rounded-[12px] border border-field-border p-[30px]">
      <Skeleton className="size-[62px] rounded-[10%]" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20 rounded-sm" />
        <Skeleton className="h-5 w-44 rounded-sm" />
      </div>
      <Skeleton className="h-3 w-56 rounded-sm" />
    </li>
  );
}

function FieldSkeleton({ half = false }: { half?: boolean }) {
  return (
    <div className={`flex w-full flex-col gap-2 px-[5px] ${half ? "min-[768px]:w-1/2" : ""}`}>
      <Skeleton className="h-4 w-16 rounded-sm" />
      <Skeleton className="h-10 w-full rounded-[8px]" />
    </div>
  );
}

// Mirrors the Contact page: hero, three cards, then the message form
export default function ContactPageSkeleton() {
  return (
    <div role="status" aria-label="Loading contact">
      <section className="border-b border-hero-border bg-white px-[10px] py-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 p-[10px]">
          <Skeleton className="h-9 w-40 rounded-full" />
          <Skeleton className="h-12 w-3/4 max-w-[520px] rounded-sm min-[1025px]:h-[70px]" />
          <Skeleton className="h-4 w-2/3 max-w-[560px] rounded-sm" />
        </div>
      </section>

      <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
        <div className="mx-auto w-full max-w-[1200px] py-5 min-[768px]:py-10 min-[1025px]:py-[60px]">
          <ul className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-3 min-[768px]:p-[10px]">
            {Array.from({ length: CARD_COUNT }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 pt-5 min-[768px]:w-[74%] min-[768px]:pt-[50px]">
          <Skeleton className="h-3 w-28 rounded-sm" />
          <Skeleton className="h-10 w-72 rounded-sm min-[1025px]:h-14" />
          <div className="flex flex-wrap gap-y-[27px] pt-4">
            <FieldSkeleton half />
            <FieldSkeleton half />
            <FieldSkeleton />
            <Skeleton className="mx-[5px] h-[100px] w-full rounded-[8px]" />
            <Skeleton className="mx-[5px] h-10 w-40 rounded-[3px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
