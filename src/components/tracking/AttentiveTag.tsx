// src/components/tracking/AttentiveTag.tsx

import Script from "next/script";
import { getAttentiveScriptUrl } from "@/lib/attentive";

// Loads Attentive's script on every page. It reads the window.attn_* values
// that AttentiveProduct and AttentiveCart set, and sends them to Attentive.
export default function AttentiveTag() {
  const src = getAttentiveScriptUrl();

  // No domain in the env file means Attentive is not set up, so load nothing
  if (!src) return null;

  return <Script src={src} strategy="afterInteractive" />;
}
