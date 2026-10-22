// src/components/product/ReviewCard.tsx

import StarRow from "./StarRow";
import type { ProductReview } from "@/types/review";

interface Props {
  review: ProductReview;
}

export default function ReviewCard({ review }: Props) {
  // The round avatar shows the first letter of the name, like the WiserReview widget
  const initial = review.author.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex flex-col gap-3 rounded-img bg-cream p-4">
      <StarRow score={review.rating} size={16} gapClass="gap-0.5" />

      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue text-[16px] font-semibold text-white"
          aria-hidden="true"
        >
          {initial}
        </span>
        <p className="text-[14px] font-semibold leading-[22px] text-ink-dark">
          {review.author}
        </p>
      </div>

      <p className="text-[14px] leading-[22px] text-ink">{review.body}</p>
    </article>
  );
}
