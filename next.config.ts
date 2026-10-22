// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets static pages (shop/product/coas) prerender and cache even though the
  // root layout reads cookies() for the age gate — only the part that reads
  // the cookie stays dynamic, the rest ships as a cached static shell.
  cacheComponents: true,

  images: {
    // Every WordPress image is served through our own /media route (see lib/media.ts), so no remote
    // host is listed here: the backend address must not end up in the browser bundle.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Serve WP images directly. On Vercel the optimizer fetches each image from
    // WordPress server-side and intermittently fails with
    // OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED (WP slow / rate-limited / timeout).
    unoptimized: true,
  },

  poweredByHeader: false,

  // /product/<slug> matches the live WordPress URLs; redirect the old /shop/ form
  async redirects() {
    return [
      { source: "/shop/:slug", destination: "/product/:slug", permanent: true },

      // The WordPress reset email links to /account?key=…&login=…, but the "set a new
      // password" form lives at /account/lost-password. When both values are present we
      // forward the visitor there (Next.js keeps the query string on the redirect).
      // It is temporary (not permanent) so browsers never cache it for normal /account visits.
      {
        source: "/account",
        has: [
          { type: "query", key: "key" },
          { type: "query", key: "login" },
        ],
        destination: "/account/lost-password",
        permanent: false,
      },

      // Old WooCommerce my-account URLs → the Next.js account pages
      { source: "/my-account", destination: "/account", permanent: true },
      {
        source: "/my-account/edit-account",
        destination: "/account/details",
        permanent: true,
      },
      {
        source: "/my-account/edit-address",
        destination: "/account/addresses",
        permanent: true,
      },
      {
        source: "/my-account/edit-address/:type",
        destination: "/account/addresses/:type",
        permanent: true,
      },
      {
        source: "/my-account/view-order/:orderId",
        destination: "/account/orders/:orderId",
        permanent: true,
      },
      {
        source: "/my-account/lost-password",
        destination: "/account/lost-password",
        permanent: true,
      },
      // Anything else under my-account keeps its tail, e.g. /my-account/orders
      { source: "/my-account/:path*", destination: "/account/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
