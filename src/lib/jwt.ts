// src/lib/jwt.ts
// Pure JWT helpers — no next/headers, so proxy.ts can use them too.

// Refresh a little early so a slow request never travels with a dead token
const EXPIRY_SAFETY_SECONDS = 30;

// JWTs carry their own expiry in the middle segment — read it instead of guessing
export function readTokenExpiry(authToken: string): number {
  try {
    const payload = authToken.split(".")[1];
    if (!payload) return 0;
    const json = Buffer.from(payload, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : 0;
  } catch {
    return 0;
  }
}

export function isTokenFresh(expiresAt: number): boolean {
  if (!expiresAt) return false;
  return Date.now() / 1000 < expiresAt - EXPIRY_SAFETY_SECONDS;
}

// Which WordPress user a token belongs to. Used to notice that the browser is
// now a different person, so one shopper never inherits another's cart.
// The id is stable across logins; the token itself is not.
export function readTokenUser(authToken: string): string {
  try {
    const payload = authToken.split(".")[1];
    if (!payload) return "";
    const json = Buffer.from(payload, "base64").toString("utf8");
    const parsed = JSON.parse(json) as {
      sub?: string | number;
      data?: { user?: { id?: string | number } };
    };
    const id = parsed.data?.user?.id ?? parsed.sub;
    return id === undefined || id === null ? "" : String(id);
  } catch {
    return "";
  }
}
