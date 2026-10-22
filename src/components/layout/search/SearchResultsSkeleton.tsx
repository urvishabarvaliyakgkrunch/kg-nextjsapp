// src/components/layout/search/SearchResultsSkeleton.tsx
import Skeleton from "@/components/ui/Skeleton";

// Same row size as SearchResultRow, so nothing jumps when the real results land
const ROW_NAME_WIDTHS = ["w-48", "w-40", "w-56"];

export default function SearchResultsSkeleton() {
  return (
    <div role="status" aria-label="Loading search results" className="px-5 pb-5 pt-4">
      <Skeleton className="mb-3 h-3 w-20 rounded-xs" />
      {ROW_NAME_WIDTHS.map((width) => (
        <div key={width} className="flex items-center gap-4 py-2">
          <Skeleton className="size-14 shrink-0 rounded-xs" />
          <Skeleton className={`h-4 rounded-xs ${width}`} />
          <Skeleton className="ml-auto h-4 w-14 rounded-xs" />
        </div>
      ))}
    </div>
  );
}
