// src/components/product/ReviewsSection.tsx

import SectionHeader from "./SectionHeader";
import ReviewsSummary from "./ReviewsSummary";
import ReviewCard from "./ReviewCard";
import WriteReviewButton from "./WriteReviewButton";
import type { ProductReviews } from "@/types/review";

interface Props {
  // null means WordPress could not be reached
  reviews: ProductReviews | null;
}

// Pick the line shown under "Customer Reviews", so the JSX below stays simple
function statusLine(reviews: ProductReviews | null): string | null {
  if (!reviews) return "Reviews are not available right now";
  if (reviews.count === 0) return "Be the first customer to write a review";
  return null;
}

export default function ReviewsSection({ reviews }: Props) {
  const status = statusLine(reviews);

  return (
    <section className="border-t border-line bg-ruo-bg">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-[10px] py-[50px] min-[768px]:py-[3.84vw]">
        <SectionHeader eyebrow="Common Reviews" title="Write Reviews Here" />

        <div className="mx-[10px] flex flex-col gap-5 rounded-img px-[15px] py-[30px] text-black">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-2.5 text-[21px] font-semibold leading-[25px]">
                Customer Reviews
              </p>
              {status ? (
                <p className="text-[14px] leading-[22px]">{status}</p>
              ) : (
                reviews && <ReviewsSummary rating={reviews.rating} count={reviews.count} />
              )}
            </div>

            {reviews?.writeReviewUrl && (
              <WriteReviewButton href={reviews.writeReviewUrl} />
            )}
          </div>

          {reviews && reviews.reviews.length > 0 && (
            <div className="grid grid-cols-1 gap-4 border-t border-line pt-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.reviews.map((review, index) => (
                <ReviewCard key={`${review.author}-${index}`} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
