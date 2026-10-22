// src/components/coas/CoaSearchResults.tsx
"use client";

import SampleCoaCard from "@/components/coas/SampleCoaCard";
import SampleCoaCardSkeleton from "@/components/coas/SampleCoaCardSkeleton";
import type { CoaSearchState } from "@/hooks/useCoaSearch";

interface Props {
  state: CoaSearchState;
  query: string;
  // Spacing differs between the home section and the /coas page
  listClassName?: string;
}

export default function CoaSearchResults({ state, query, listClassName = "" }: Props) {
  const { data, isActive, isLoading } = state;

  // aria-live tells screen readers the list changed as the visitor types
  return (
    <div aria-live="polite">
      {isActive && isLoading && (
        <ul className={listClassName} role="status" aria-label="Loading COAs">
          <SampleCoaCardSkeleton />
          <SampleCoaCardSkeleton />
        </ul>
      )}

      {isActive && !isLoading && data.length > 0 && (
        <ul className={listClassName}>
          {data.map((item) => (
            <SampleCoaCard key={`${item.index}-${item.name}`} {...item} />
          ))}
        </ul>
      )}

      {isActive && !isLoading && data.length === 0 && (
        <p className="py-4 text-center font-mono text-[14px] font-medium leading-[18px] text-muted-2">
          No COA found for &ldquo;{query.trim()}&rdquo;.
        </p>
      )}
    </div>
  );
}
