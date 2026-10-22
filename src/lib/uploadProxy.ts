// src/lib/uploadProxy.ts
// Server-only. Streams files from WordPress's uploads folder, so browsers only ever see our own
// /media and /coa-files addresses and the backend host never reaches the page.

// The test backend does not hold every file the live site does, so a second origin is tried on a miss.
// COA_FILES_URL is server-only; leave it unset once NEXT_PUBLIC_WP_URL is the live site.
function origins(): string[] {
  const list = [process.env.NEXT_PUBLIC_WP_URL, process.env.COA_FILES_URL].filter(
    (value): value is string => Boolean(value)
  );
  return [...new Set(list.map((value) => value.replace(/\/+$/, "")))];
}

const REQUEST_TIMEOUT_MS = 15_000;

export const PDF_EXTENSIONS = [".pdf"];
export { MEDIA_EXTENSIONS } from "@/lib/media";

const NOT_FOUND = () => new Response("Not found", { status: 404 });

export async function proxyUpload(
  segments: string[],
  allowed: string[],
  range?: string | null
): Promise<Response> {
  const last = segments[segments.length - 1]?.toLowerCase() ?? "";

  // Each segment arrives decoded, so ".." or a slash hiding in one must be refused
  const safe =
    segments.length > 0 &&
    segments.every((part) => part && part !== "." && part !== ".." && !/[\\/]/.test(part)) &&
    allowed.some((ext) => last.endsWith(ext));
  if (!safe) return NOT_FOUND();

  const path = segments.map(encodeURIComponent).join("/");

  for (const origin of origins()) {
    try {
      const upstream = await fetch(`${origin}/wp-content/uploads/${path}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        // A missing file is redirected to a placeholder page on another host; that is a miss, not a file
        redirect: "manual",
        // Browsers seek inside a video with Range requests, so pass them through
        headers: range ? { Range: range } : undefined,
      });
      if (!upstream.ok || !upstream.body) continue;

      const type = upstream.headers.get("content-type") ?? "application/octet-stream";
      // WordPress answers a missing file with an HTML page and a 200 on some setups
      if (type.startsWith("text/html")) continue;

      const headers = new Headers({
        "Content-Type": type,
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000",
      });
      for (const name of ["content-length", "content-range", "accept-ranges"]) {
        const value = upstream.headers.get(name);
        if (value) headers.set(name, value);
      }
      return new Response(upstream.body, { status: upstream.status, headers });
    } catch (error) {
      console.warn("[uploadProxy] fetch failed", origin, error);
    }
  }

  return NOT_FOUND();
}
