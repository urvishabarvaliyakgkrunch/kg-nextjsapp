// src/lib/media.ts
// Server-only. Swaps WordPress image addresses for our own /media path, so the backend host
// never reaches the page. PDFs keep their address here — the COA mapper routes those itself.

export const MEDIA_PREFIX = "/media";

// Only these file types move to /media. Anything else (PDFs have their own route) keeps its address.
export const MEDIA_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg", ".ico",
  ".mp4", ".webm",
];

function hostOf(value: string | undefined): string | null {
  try {
    return value ? new URL(value).hostname : null;
  } catch {
    return null;
  }
}

// new2.example.com and example.com both count as the backend, like toHref treats them
function backendHosts(): string[] {
  const hosts = new Set<string>();
  for (const value of [process.env.NEXT_PUBLIC_WP_URL, process.env.COA_FILES_URL]) {
    const host = hostOf(value);
    if (!host) continue;
    hosts.add(host);
    hosts.add(host.split(".").slice(-2).join("."));
  }
  return [...hosts];
}

let cached: { key: string; pattern: RegExp | null } | null = null;

function pattern(): RegExp | null {
  const hosts = backendHosts();
  const key = hosts.join("|");
  if (cached?.key === key) return cached.pattern;

  const escaped = hosts.map((host) => host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // Stops at quotes, spaces, brackets and backslashes, so a URL inside HTML or srcset ends cleanly
  const built = escaped.length
    ? new RegExp(
        `https?:\\/\\/(?:[a-z0-9-]+\\.)*(?:${escaped.join("|")})\\/+wp-content\\/uploads\\/([^"'\\s<>()\\\\]+)`,
        "gi"
      )
    : null;
  cached = { key, pattern: built };
  return built;
}

export function maskMediaUrl(url: string): string {
  const re = pattern();
  if (!re) return url;
  return url.replace(new RegExp(re.source, re.flags), (whole, rest: string) =>
    MEDIA_EXTENSIONS.some((ext) => rest.toLowerCase().split(/[?#]/)[0].endsWith(ext))
      ? `${MEDIA_PREFIX}/${rest}`
      : whole
  );
}

// Walks a GraphQL answer and masks every image address inside it, ACF HTML included
export function maskMediaUrls<T>(data: T): T {
  if (data === null || data === undefined) return data;
  const re = pattern();
  if (!re) return data;

  const json = JSON.stringify(data);
  const masked = maskMediaUrl(json);
  return masked === json ? data : (JSON.parse(masked) as T);
}

// Third parties and structured data need a full address, and /media paths are relative to our site
export function absoluteUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (!path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${path}`;
}
