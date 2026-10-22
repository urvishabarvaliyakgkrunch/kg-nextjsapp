// src/components/tracking/TagadaTracker.tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  TAGADA,
  TAGADA_TRACKER_URL,
  TGD_COOKIE,
} from "@/lib/tagada/config";

// What the tracker hands back once it has made a session
interface TrackerSession {
  cmsToken?: string;
  customerId?: string;
  sessionId?: string;
}

interface TagadaTrackerApi {
  init: (options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    TagadaTracker?: TagadaTrackerApi;
  }
}

const DAY = 86400;

function setCookie(name: string, value: string, maxAge = DAY) {
  document.cookie = `${name}=${value};path=/;samesite=lax;max-age=${maxAge}`;
}

// First touch wins: a param captured on the ad landing page is never replaced
// by one from a later page, so ?gclid= survives a filter or pagination click.
function persistQueryParams(): string {
  try {
    const stored = new URLSearchParams(
      sessionStorage.getItem("tgd_query_params") ?? ""
    );
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (!stored.has(key)) stored.set(key, value);
    });

    const merged = stored.toString();
    if (!merged) return "";

    sessionStorage.setItem("tgd_query_params", merged);
    return `?${merged}`;
  } catch {
    return window.location.search;
  }
}

// Ad cookies are read server-side at checkout. This cookie only carries the
// query params, which the server cannot recover from the request on its own.
function storeTrackingMeta() {
  try {
    const data = JSON.stringify({ queryParams: persistQueryParams() });
    setCookie(TGD_COOKIE.trackingMeta, encodeURIComponent(data));
  } catch {
    // A blocked cookie jar must not stop the page rendering
  }
}

// ?draft=true switches the funnel to Tagada's staging environment and sticks
// for 30 days, matching the plugin
function resolveDraft() {
  const draft = new URLSearchParams(window.location.search).get("draft");
  if (draft !== null) setCookie(TGD_COOKIE.draft, draft, DAY * 30);
}

// Loads Tagada's tracker on every page. It has to run in the browser so Tagada
// sees the shopper's real device and IP, not our server's.
export default function TagadaTracker() {
  useEffect(() => {
    resolveDraft();
    storeTrackingMeta();
  }, []);

  function startTracker() {
    const tracker = window.TagadaTracker;
    if (!tracker) return;

    tracker.init({
      storeId: TAGADA.storeId,
      accountId: TAGADA.accountId,
      funnelId: TAGADA.funnelId,
      stepId: TAGADA.stepId,
      apiBaseUrl: TAGADA.apiUrl,
      debug: TAGADA.debug,
      onReady: (session: TrackerSession) => {
        setCookie(TGD_COOKIE.token, session.cmsToken ?? "");
        setCookie(TGD_COOKIE.customerId, session.customerId ?? "");
        setCookie(TGD_COOKIE.funnelSessionId, session.sessionId ?? "");
        setCookie(TGD_COOKIE.storeId, TAGADA.storeId);
        storeTrackingMeta();
      },
    });
  }

  if (!TAGADA.storeId) return null;

  return (
    <Script
      src={TAGADA_TRACKER_URL}
      strategy="afterInteractive"
      onReady={startTracker}
    />
  );
}
