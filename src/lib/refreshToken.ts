// src/lib/refreshToken.ts
// The refresh call on its own, with no next/headers import, so both the server
// components and proxy.ts can run it (§C2 — one copy of the mutation).

// A hung WordPress must not hold a page render open forever
const TIMEOUT_MS = 15_000;

const REFRESH = `
  mutation Refresh($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

// Throws on a network or server fault; returns null only when WordPress rejects the token
export async function refreshAuthToken(refreshToken: string): Promise<string | null> {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: REFRESH, variables: { refreshToken } }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // A non-200 from WordPress means the token is rejected, not that the backend is down.
  // Return null so the caller treats it as a sign-out, not an unreachable server.
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: { refreshJwtAuthToken?: { authToken?: string | null } | null };
    errors?: { message: string }[];
  };

  // WordPress says so when the refresh token itself is dead — that is a real sign-out
  if (json.errors?.length) return null;

  return json.data?.refreshJwtAuthToken?.authToken ?? null;
}
