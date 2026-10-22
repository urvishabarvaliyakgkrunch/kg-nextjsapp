// src/proxy.ts
// Keeps the sign-in cookie fresh. A page render cannot write cookies, so without this
// every account page would refresh the token again — one extra WordPress round trip
// each time, and a sign-out whenever that call was slow.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenFresh, readTokenExpiry } from "@/lib/jwt";
import { refreshAuthToken } from "@/lib/refreshToken";
import { isValidProductSlug } from "@/lib/queries/shop";
import {
  REFERRAL_COOKIE,
  REFERRAL_MAX_AGE,
  REFERRAL_PARAM,
} from "@/lib/referralCookie";
import type { Session } from "@/types/account";

const SESSION_COOKIE = "elx_session";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const PRODUCT_PATH = /^\/product\/([^/]+)\/?$/;

// Cache Components streams a shell before the page's own notFound() resolves, so a missing
// slug still answers 200 (soft 404, see H2). Checking here runs before any response is sent,
// so a real 404 can go out. Fails open (lets the page handle it) if WordPress is unreachable.
async function productNotFoundResponse(
  request: NextRequest
): Promise<NextResponse | null> {
  const match = PRODUCT_PATH.exec(request.nextUrl.pathname);
  if (!match) return null;

  const slug = decodeURIComponent(match[1]);
  try {
    if (await isValidProductSlug(slug)) return null;
  } catch {
    return null;
  }

  return new NextResponse(PRODUCT_NOT_FOUND_HTML, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const PRODUCT_NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Product not found | Elixser Peptides</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #111111; color: #fff; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .wrap { text-align: center; padding: 24px; max-width: 480px; }
  h1 { font-size: 28px; margin: 0 0 12px; }
  p { color: #8A8A85; margin: 0 0 28px; line-height: 1.5; }
  a { display: inline-block; margin: 0 8px; padding: 12px 24px; border-radius: 3px;
    text-decoration: none; font-weight: 500; }
  a.primary { background: #0165FF; color: #fff; }
  a.secondary { border: 1px solid rgba(255,255,255,0.33); color: #fff; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>This product couldn't be found</h1>
    <p>It may have been renamed or removed from the catalog.</p>
    <a class="primary" href="/shop">Shop Catalog</a>
    <a class="secondary" href="/">Home</a>
  </div>
</body>
</html>`;

function parseSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.authToken || !parsed.refreshToken) return null;
    return {
      authToken: parsed.authToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt ?? readTokenExpiry(parsed.authToken),
      remember: parsed.remember ?? false,
    };
  } catch {
    return null;
  }
}

// A friend's link carries ?wlr_ref=CODE — remembered so sign-up can claim it later
function rememberReferral(request: NextRequest, response: NextResponse): NextResponse {
  const code = request.nextUrl.searchParams.get(REFERRAL_PARAM);
  if (code) {
    response.cookies.set(REFERRAL_COOKIE, code.slice(0, 64), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFERRAL_MAX_AGE,
    });
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const notFound = await productNotFoundResponse(request);
  if (notFound) return notFound;

  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  // Only the signed-in area needs a refresh; every other page just passes through
  const needsRefresh =
    request.nextUrl.pathname.startsWith("/account") &&
    session &&
    !isTokenFresh(session.expiresAt);
  if (!needsRefresh) {
    return rememberReferral(request, NextResponse.next());
  }

  let authToken: string | null;
  try {
    authToken = await refreshAuthToken(session.refreshToken);
  } catch {
    // WordPress is down or slow. Leave the cookie alone and let the page decide —
    // wiping it here would sign the shopper out over a hiccup.
    return rememberReferral(request, NextResponse.next());
  }

  const response = rememberReferral(request, NextResponse.next());

  // WordPress rejected the refresh token, so the session really is over
  if (!authToken) {
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const next: Session = {
    ...session,
    authToken,
    expiresAt: readTokenExpiry(authToken),
  };

  response.cookies.set(SESSION_COOKIE, JSON.stringify(next), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(session.remember ? { maxAge: ONE_YEAR_SECONDS } : {}),
  });

  return response;
}

// Runs on pages only — files, images and API routes never carry a referral link
export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
