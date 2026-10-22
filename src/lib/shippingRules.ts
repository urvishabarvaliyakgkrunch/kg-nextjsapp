// src/lib/shippingRules.ts
// Server-only. Reads the free-shipping minimum from WooCommerce (Elixser Shipping Rules plugin)
// so the cart progress bar always matches the real rule. Falls back to the default below.

import { cacheLife, cacheTag } from "next/cache";
import { FREE_SHIPPING_MINIMUM } from "@/lib/cartRules";

const URL = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/elx/v1/shipping-rules`;

export const SHIPPING_RULES_TAG = "shipping-rules";

// Changes rarely — a week is plenty; clear with /api/revalidate?tag=shipping-rules after editing Woo
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

// A slow backend must never hold the page open
const REQUEST_TIMEOUT_MS = 5_000;

export async function getFreeShippingMinimum(): Promise<number> {
  "use cache";
  cacheLife("weeks");
  cacheTag(SHIPPING_RULES_TAG);
  try {
    const res = await fetch(URL, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: ONE_WEEK_SECONDS, tags: [SHIPPING_RULES_TAG] },
    });
    if (!res.ok) {
      cacheLife("minutes");
      return FREE_SHIPPING_MINIMUM;
    }
    const data = (await res.json()) as { free_shipping_min?: number | null };
    const min = Number(data.free_shipping_min);
    return min > 0 ? min : FREE_SHIPPING_MINIMUM;
  } catch {
    // A failure must not be remembered for long — and "seconds" would make the root layout dynamic and break the build
    cacheLife("minutes");
    return FREE_SHIPPING_MINIMUM;
  }
}
