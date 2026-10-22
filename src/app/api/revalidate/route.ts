// src/app/api/revalidate/route.ts
// Clears the cached WordPress data on demand, so a catalog change shows up
// without waiting out the 1-hour window or restarting the server.

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { PRODUCTS_TAG } from "@/lib/graphql";
import { LOYALTY_TAG } from "@/lib/loyalty";
import { COAS_PAGE_TAG } from "@/lib/queries/coas";
import { CONTACT_PAGE_TAG } from "@/lib/queries/contact";
import { FAQ_PAGE_TAG } from "@/lib/queries/faq";
import { GLOBAL_TAG } from "@/lib/queries/global";
import { HOME_PAGE_TAG } from "@/lib/queries/home";
import { RESEARCH_PAGE_TAG } from "@/lib/queries/research";
import { REVIEWS_TAG } from "@/lib/reviews";
import { SHIPPING_RULES_TAG } from "@/lib/shippingRules";

// Every tag the site caches under. Each page has its own tag, so clearing only "products"
// leaves the top bar, FAQ, Home etc. on the old copy.
const ALL_TAGS = [
  PRODUCTS_TAG,
  GLOBAL_TAG,
  HOME_PAGE_TAG,
  FAQ_PAGE_TAG,
  COAS_PAGE_TAG,
  CONTACT_PAGE_TAG,
  RESEARCH_PAGE_TAG,
  SHIPPING_RULES_TAG,
  REVIEWS_TAG,
  LOYALTY_TAG,
  "wc-locations",
];

function clearCache(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not set in .env.local." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  if (url.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Bad secret." }, { status: 401 });
  }

  // No tag, or tag=all, clears everything; otherwise one tag or a comma-separated list
  const tagParam = url.searchParams.get("tag");
  const tags =
    !tagParam || tagParam === "all"
      ? ALL_TAGS
      : tagParam.split(",").map((t) => t.trim()).filter(Boolean);

  // "now" drops the cache outright — the next request waits for fresh data.
  // "max" keeps serving the old copy while it refreshes, better for a live site.
  const blocking = url.searchParams.get("mode") !== "max";
  for (const tag of tags) revalidateTag(tag, blocking ? { expire: 0 } : "max");

  return NextResponse.json({
    cleared: tags,
    mode: blocking ? "now" : "max",
    clearedAt: new Date().toISOString(),
  });
}

// GET so the URL can simply be opened in a browser tab.
// The secret lands in browser history this way — on the live site use POST.
export async function GET(request: Request) {
  return clearCache(request);
}

export async function POST(request: Request) {
  return clearCache(request);
}
