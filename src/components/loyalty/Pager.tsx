// src/components/loyalty/Pager.tsx
"use client";

interface Props {
  page: number;
  hasMore: boolean;
  loading: boolean;
  onGo: (page: number) => void;
}

// Prev / Next like the live widget; hidden when everything fits on one page
export default function Pager({ page, hasMore, loading, onGo }: Props) {
  if (page <= 1 && !hasMore) return null;

  const button =
    "font-sans text-[16px] text-blue hover:underline disabled:opacity-40 disabled:no-underline";

  return (
    <div className="mt-2 flex justify-end gap-4" aria-busy={loading}>
      {page > 1 && (
        <button type="button" disabled={loading} onClick={() => onGo(page - 1)} className={button}>
          Prev
        </button>
      )}
      {hasMore && (
        <button type="button" disabled={loading} onClick={() => onGo(page + 1)} className={button}>
          Next
        </button>
      )}
    </div>
  );
}
