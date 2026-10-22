// src/lib/graphql.ts

import { maskMediaUrls } from "@/lib/media";

// Tag every catalog query so one revalidate call can clear them all
export const PRODUCTS_TAG = "products";

// WordPress sends the "new account" mail inside the register request, and a stuck SMTP
// server can hold that request open for minutes. Without a cap the button spins forever.
const REQUEST_TIMEOUT_MS = 30_000;

// Calls slower than this are logged
const SLOW_REQUEST_MS = 2_000;

export class BackendTimeoutError extends Error {
  constructor() {
    super("The store took too long to answer. Please try again.");
    this.name = "BackendTimeoutError";
  }
}

export interface GqlOptions {
  revalidate?: number;
  noCache?: boolean;
  tags?: string[];
  // JWT from the WordPress login — sent as a Bearer token for customer-only data
  authToken?: string;
}

export async function gql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: GqlOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.authToken) {
    headers.Authorization = `Bearer ${options.authToken}`;
  }

  // One shopper's orders must never land in a shared cache
  const skipCache = options.noCache || Boolean(options.authToken);

  // Shows in the Vercel logs which WordPress calls are slow, and whether the wait is before or after WordPress answers
  const startedAt = Date.now();
  let res: Response;
  try {
    res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: skipCache
        ? { revalidate: 0 }
        : {
            revalidate: options.revalidate ?? 3600,
            tags: options.tags ?? [PRODUCTS_TAG],
          },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new BackendTimeoutError();
    }
    throw error;
  }

  const waitedMs = Date.now() - startedAt;
  if (waitedMs > SLOW_REQUEST_MS) {
    const operation = query.match(/(?:query|mutation)\s+(\w+)/)?.[1] ?? "unnamed";
    console.warn(`[graphql] slow ${operation}: ${waitedMs}ms (HTTP ${res.status})`);
  }

  if (!res.ok) {
    throw new Error(`GraphQL network error: ${res.status} ${res.statusText}`);
  }

  // WordPress sometimes answers 200 with nothing while it restarts or hits a PHP fatal
  const raw = await res.text();
  if (!raw.trim()) {
    throw new Error("The store sent an empty reply. Please try again in a moment.");
  }

  // HTML here means the URL is wrong or a firewall answered instead of WordPress
  if (raw.trimStart().startsWith("<")) {
    console.error("[graphql] got HTML instead of JSON from", process.env.NEXT_PUBLIC_GRAPHQL_URL, raw.slice(0, 200));
    throw new Error("The store sent an unexpected reply. Please try again in a moment.");
  }

  const json = JSON.parse(raw);
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  // Customer answers are left alone: download links there must stay exactly as WordPress wrote them
  return (options.authToken ? json.data : maskMediaUrls(json.data)) as T;
}
