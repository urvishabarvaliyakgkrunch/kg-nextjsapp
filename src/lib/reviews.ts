// src/lib/reviews.ts
// Server-only. The only file that talks to the Elixser Reviews API plugin.
// WordPress already holds the reviews, so we read them here instead of loading WiserReview's script.

import { cacheLife } from "next/cache";
import type { ProductReviews, ProductReviewsById } from "@/types/review";

const BASE = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/elx/v1/reviews`;

// Reviews change rarely, so they cache like the rest of the catalog (.clauderules D1)
export const REVIEWS_TAG = "reviews";
const REVIEWS_TTL = 3600;

// A slow backend must never hold the product page open
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * Reviews for one product.
 * Returns null when WordPress cannot be reached, so the page can say "not available"
 * instead of showing a false "no reviews yet".
 */
export async function getProductReviews(
  productId: number
): Promise<ProductReviews | null> {
  // Cached as a whole, so a repeat visit never waits on WordPress for reviews
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`${BASE}?product_ids=${productId}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVIEWS_TTL, tags: [REVIEWS_TAG] },
    });

    if (!res.ok) {
      // Without this line a failed call looks the same as "no data" in the terminal
      console.warn(`[reviews] failed: HTTP ${res.status}`);
      // A failure must not be remembered for hours
      cacheLife("seconds");
      return null;
    }

    const byId = (await res.json()) as ProductReviewsById;
    const reviews = byId[String(productId)] ?? null;
    if (!reviews) return null;

    // WordPress has no form link saved, so fall back to the one set in .env
    const formUrl = process.env.REVIEW_FORM_URL;
    if (!reviews.writeReviewUrl && formUrl) {
      return { ...reviews, writeReviewUrl: `${formUrl}?pid=${productId}` };
    }
    return reviews;
  } catch (error) {
    console.warn("[reviews] request failed", error);
    cacheLife("seconds");
    return null;
  }
}
