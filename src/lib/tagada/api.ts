// src/lib/tagada/api.ts
// Server-only. The four TagadaPay calls the plugin makes, nothing more.
// None of these create an order — the order exists only after the shopper pays
// on Tagada's own hosted page.

import type {
  TagadaAnonSession,
  TagadaCheckoutInit,
  TagadaClaims,
  TagadaFunnelInit,
  TagadaInitSession,
  TagadaNavigate,
  TagadaSession,
} from "@/types/tagada";
import { TAGADA, TAGADA_PLUGIN_VERSION } from "./config";

const TIMEOUT_MS = 15_000;

export class TagadaError extends Error {
  constructor(message: string, readonly detail?: unknown) {
    super(message);
    this.name = "TagadaError";
  }
}

async function post<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "store-id": TAGADA.storeId,
    "X-Tagada-Plugin-Version": `wc-checkout/${TAGADA_PLUGIN_VERSION}`,
  };
  if (token) headers["x-cms-token"] = token;

  let res: Response;
  try {
    res = await fetch(`${TAGADA.apiUrl}${endpoint}`, {
      method: "POST",
      cache: "no-store",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    throw new TagadaError(`Could not reach Tagada (${endpoint}).`, cause);
  }

  const payload: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new TagadaError(
      `Tagada returned status ${res.status} for ${endpoint}.`,
      payload
    );
  }

  return payload as T;
}

/**
 * Read the claims out of a Tagada session token.
 *
 * The token is a JWT whose payload already names the customer and the CMS
 * session it belongs to. Tagada checks the body of /funnel/initialize against
 * those claims and answers 403 on any disagreement, so they are the only safe
 * source for those two values — a cookie can go stale while the token does not.
 * Nothing security-related is decided here, so the signature is not checked.
 */
export function readTokenClaims(token: string): TagadaClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const json = Buffer.from(payload, "base64").toString("utf8");
    const claims = JSON.parse(json) as Partial<TagadaClaims> & { exp?: number };

    if (!claims.customerId || !claims.sessionId) return null;
    // An expired token fails the same 403 way, so treat it as missing
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null;

    return {
      customerId: claims.customerId,
      sessionId: claims.sessionId,
      storeId: claims.storeId ?? "",
    };
  } catch {
    return null;
  }
}

// Fallback path only — normally the browser tracker has already made a session
// and left the token in a cookie. Used when those cookies are missing.
export async function initSession(locale: string): Promise<TagadaSession> {
  const anon = await post<TagadaAnonSession>("/api/v1/cms/session/anonymous", {
    storeId: TAGADA.storeId,
    role: "anonymous",
    draft: false,
  });

  if (!anon.token || !anon.sessionId) {
    throw new TagadaError("Tagada did not return an anonymous session.", anon);
  }

  const session = await post<TagadaInitSession>(
    "/api/v1/cms/session/v2/init",
    {
      storeId: TAGADA.storeId,
      accountId: TAGADA.accountId,
      customerId: "anon_placeholder",
      browserLocale: locale,
      draft: false,
      queryLocale: null,
      queryCurrency: null,
      userAgent: "Next.js/Server",
    },
    anon.token
  );

  const customerId = session.customer?.id;
  if (!customerId) {
    throw new TagadaError("Tagada session has no customer ID.", session);
  }

  return { token: anon.token, customerId, sessionId: anon.sessionId };
}

// Starts a funnel session. currentUrl carries the saved ad-click params, or
// Tagada records the visit as coming from nowhere.
//
// cmsSessionId must be the real session the token was issued for. The official
// plugin sends the literal string "sess_placeholder" here, which Tagada now
// rejects with 403 "Session does not match authenticated customer or store" —
// so this is the one place we knowingly differ from it.
export async function initFunnel(
  claims: TagadaClaims,
  token: string,
  currentUrl: string,
  draft: boolean
): Promise<string> {
  const body: Record<string, unknown> = {
    cmsSession: {
      customerId: claims.customerId,
      sessionId: claims.sessionId,
      storeId: TAGADA.storeId,
      accountId: TAGADA.accountId,
    },
    funnelId: TAGADA.funnelId,
    entryStepId: TAGADA.stepId,
    funnelStepId: TAGADA.stepId,
    currentUrl,
    draft,
  };

  if (draft) {
    body.tagadaClientEnv = "development";
    body.funnelEnv = "staging";
  }

  const funnel = await post<TagadaFunnelInit>(
    "/api/v1/funnel/initialize",
    body,
    token
  );

  const sessionId = funnel.context?.sessionId;
  if (!sessionId) {
    throw new TagadaError("Tagada funnel has no session ID.", funnel);
  }

  return sessionId;
}

// Hands the cart over and gets back the hosted checkout URL to send the
// shopper to. Still no order at this point.
export async function navigateCheckout(
  sessionId: string,
  checkoutInit: TagadaCheckoutInit,
  token: string,
  currentUrl: string
): Promise<string> {
  const navigate = await post<TagadaNavigate>(
    "/api/v1/funnel/navigate",
    {
      currentUrl,
      fireAndForget: false,
      funnelStepId: TAGADA.stepId,
      sessionId,
      event: { type: "INIT_CHECKOUT", data: { checkoutInit } },
    },
    token
  );

  const url = navigate.result?.url;
  if (!url) {
    throw new TagadaError("Tagada did not return a checkout URL.", navigate);
  }

  return url;
}
