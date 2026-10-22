// src/components/account/OrdersTableSkeleton.tsx

import Skeleton from "@/components/ui/Skeleton";

// Bar widths vary per column so the rows read like text, not a barcode
const HEAD_WIDTHS = ["w-12", "w-10", "w-14", "w-12", "w-16"];
const VALUE_WIDTHS = ["w-14", "w-28", "w-24", "w-36", "w-[85px]"];

// Mirrors OrdersTable: stacked cards on phones, a five-column table from md up
export default function OrdersTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading orders"
      className="border border-row-line bg-white px-4 py-2 md:px-[30px] md:pt-4 md:pb-[3px]"
    >
      <div className="hidden grid-cols-5 pb-[9px] md:grid">
        {HEAD_WIDTHS.map((w, col) => (
          <Skeleton key={col} className={`h-[21px] ${w}`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-t border-row-line py-2 first:border-t-0 md:grid md:grid-cols-5 md:items-center md:py-0 md:first:border-t"
        >
          {VALUE_WIDTHS.map((w, col) => (
            <div key={col} className="flex items-center justify-between gap-4 py-2 md:py-[9px]">
              {col === 4 ? (
                // The View button has no label on phones and fills the card width
                <Skeleton className="h-[38px] w-full md:w-[85px]" />
              ) : (
                <>
                  <Skeleton className="h-[21px] w-16 md:hidden" />
                  <Skeleton className={`h-[21px] ${w}`} />
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
