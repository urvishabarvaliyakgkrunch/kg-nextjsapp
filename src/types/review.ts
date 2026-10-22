// src/types/review.ts

// One customer review, exactly as the Elixser Reviews API plugin sends it
export interface ProductReview {
  author: string;
  body: string;
  // Stars given, 1 to 5
  rating: number;
}

// Everything the product page needs about one product's reviews
export interface ProductReviews {
  // Average stars, 0 when nobody has reviewed yet
  rating: number;
  // Total reviews. Can be bigger than reviews.length because WiserReview sends only the first few.
  count: number;
  reviews: ProductReview[];
  // Hosted WiserReview form for this product. null until the form URL is set in WordPress.
  writeReviewUrl: string | null;
}

// The API answers with one entry per product id we asked for
export type ProductReviewsById = Record<string, ProductReviews>;
