// src/lib/reviewSchema.ts
// Builds the JSON-LD that lets Google show stars next to the product in search results.

import type { ProductReviews } from "@/types/review";

interface Input {
  name: string;
  image: string;
  url: string;
  reviews: ProductReviews | null;
}

/**
 * Returns null when there is nothing honest to say.
 * Google penalises star markup for products that have no reviews.
 */
export function buildReviewSchema({ name, image, url, reviews }: Input) {
  if (!reviews || reviews.count === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    ...(image ? { image } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.rating,
      reviewCount: reviews.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.reviews.map((item) => ({
      "@type": "Review",
      author: { "@type": "Person", name: item.author },
      reviewBody: item.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: item.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
