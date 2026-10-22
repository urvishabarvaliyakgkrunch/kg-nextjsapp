// src/app/robots.ts
// Served at /robots.txt. The WordPress backend has its own robots.txt (Rank Math writes
// it) — that one belongs to the wp.* subdomain and says nothing about this site.

import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Signed-in and hand-over pages: nothing to index, and crawling them
        // wakes WordPress up on every hit
        "/account",
        "/cart",
        "/checkout",
        // Internal routes, not pages
        "/api/",
        "/media/",
        "/coa-files/",
      ],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
