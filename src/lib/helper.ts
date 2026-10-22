// src/lib/helper.ts
// Small helpers shared by every ACF mapper (home page, header, footer).

import type { AcfLink, AcfMediaEdge, LinkButton, MediaImage } from "@/types/home";

// Textareas set to "Automatically add <br>" send HTML — keep the line breaks, drop the tags
export function acfText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// WYSIWYG fields run through WordPress "the_content", where Elementor swaps in the whole page
// (styles included) — that markup would wreck our layout, so it is dropped, and any <style>/<script> too
export function acfHtml(value: string | null | undefined): string {
  const html = value?.trim() ?? "";
  if (html.includes("data-elementor-type")) return "";
  return html
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, "")
    // Admins paste bare addresses as links (href="info@…") — the browser treats those as a
    // page path and lands on the 404, so turn them into mailto links
    .replace(/href=(["'])\s*([^"'\s:/@]+@[^"'\s:/@]+\.[^"'\s:/@]+)\s*\1/gi, "href=$1mailto:$2$1");
}

// Same WYSIWYG problem, but for a field whose text we still need: Elementor's output holds the
// whole page, so pick out the one paragraph that carries the mailto link (e.g. "Email info@…")
export function acfMailtoParagraph(value: string | null | undefined): string {
  const html = value?.trim() ?? "";
  if (!html.includes("data-elementor-type")) return acfHtml(html);
  const withoutCode = html.replace(/<(style|script)[\s\S]*?<\/\1>/gi, "");
  const match = withoutCode.match(/<p>(?:(?!<\/p>)[\s\S])*?href="mailto:[\s\S]*?<\/p>/i);
  return match ? match[0] : "";
}

export function toImage(edge: AcfMediaEdge | null | undefined): MediaImage | null {
  const src = edge?.node?.sourceUrl;
  return src ? { src, alt: edge.node.altText ?? "" } : null;
}

// new2.elixserpeptides.com → elixserpeptides.com, so links to the live domain count as ours too
function siteDomain(): string {
  const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
  return wpUrl ? new URL(wpUrl).hostname.split(".").slice(-2).join(".") : "";
}

// Admins paste full URLs — links to our own site must become paths so Next.js routes them
export function toHref(url: string): string {
  let parsed: URL;
  try {
    // The base only lets plain paths like "/shop/" parse — it never reaches the output
    parsed = new URL(url, "https://path.invalid");
  } catch {
    return url;
  }

  const domain = siteDomain();
  const isOurs =
    url.startsWith("/") ||
    (domain && (parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)));
  if (!isOurs) return url;

  // WordPress paths end in "/" — Next.js routes and the active-link check expect none
  const path = parsed.pathname.length > 1 ? parsed.pathname.replace(/\/$/, "") : parsed.pathname;
  return `${path}${parsed.search}${parsed.hash}`;
}

export function toLinkButton(link: AcfLink | null | undefined): LinkButton | null {
  if (!link?.url) return null;
  return {
    label: acfText(link.title),
    href: toHref(link.url),
    target: link.target || undefined,
  };
}
