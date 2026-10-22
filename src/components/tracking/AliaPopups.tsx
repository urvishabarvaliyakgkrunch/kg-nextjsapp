// src/components/tracking/AliaPopups.tsx

import Script from "next/script";

// Same embed the WordPress site uses: shows the scratch-card popup and the "Mystery Discount" button.
const ALIA_EMBED_URL =
  "https://app.aliapopups.com/public/embed.js?shop=elixser-peptides-kg3madwd.myshopify.com";

export default function AliaPopups() {
  return <Script src={ALIA_EMBED_URL} strategy="afterInteractive" />;
}
