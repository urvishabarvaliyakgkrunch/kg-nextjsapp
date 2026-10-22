// src/lib/reviewFormat.ts
// Pure helpers that turn review data into text and numbers for the UI.

import { RATING } from "@/lib/productDefaults";
import type { ProductReviews } from "@/types/review";

// "1 review" / "3 reviews"
export function reviewCountLabel(count: number): string {
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}

/**
 * The rating line under the product title.
 * With no reviews yet we keep the old default so the page looks the same as before.
 */
export function heroRating(reviews: ProductReviews | null): {
  score: number;
  caption: string;
} {
  if (!reviews || reviews.count === 0) return RATING;
  return { score: reviews.rating, caption: reviewCountLabel(reviews.count) };
}
