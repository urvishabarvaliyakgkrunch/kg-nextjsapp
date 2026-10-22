// src/lib/coasMapper.ts
// Turns the raw COAs ACF response into section objects, so components never touch null checks.

import { acfHtml, acfText as text, toHref } from "@/lib/helper";
import type { CoasPageData, GQLCoaProduct, GQLCoasPageFields, SampleCoaItem } from "@/types/coas";

// Product ACF keys the sample card needs: dose line, two tags, and the COA PDF
export const COA_PRODUCT_META_KEYS = ["mg_per_vial", "blend_type", "class", "coas"];

// The COA search also matches the lot number printed on the vial
export const COA_LOT_META_KEY = "lot_number";

const UPLOADS_MARKER = "/wp-content/uploads/";

// WordPress PDFs go through our own /coa-files route so the backend address never reaches the browser
export function toCoaHref(url: string): string {
  const href = toHref(url);
  const at = href.indexOf(UPLOADS_MARKER);
  if (at === -1 || !href.toLowerCase().split(/[?#]/)[0].endsWith(".pdf")) return href;
  return `/coa-files/${href.slice(at + UPLOADS_MARKER.length)}`;
}

export function toSampleCoa(product: Partial<GQLCoaProduct>, position: number): SampleCoaItem | null {
  // Non-product picks in the relationship come back as empty objects
  if (!product.name) return null;
  const meta = new Map((product.metaData ?? []).map((m) => [m.key, text(m.value)]));
  const get = (key: string) => meta.get(key) ?? "";
  const coaUrl = get("coas");

  return {
    index: position,
    name: text(product.name),
    dose: get("mg_per_vial"),
    tags: [get("blend_type"), get("class")].filter(Boolean),
    href: coaUrl ? toCoaHref(coaUrl) : "",
  };
}

export function toCoasPageData(f: GQLCoasPageFields | null): CoasPageData {
  // Empty object keeps every section safe to read before the admin fills the page
  const d = f ?? ({} as Partial<GQLCoasPageFields>);

  const items = (d.coasProductSelect?.nodes ?? [])
    .map((product, i) => toSampleCoa(product, i + 1))
    .filter((item): item is SampleCoaItem => item !== null);

  return {
    hero: {
      smallHeading: text(d.heroSmallHeading),
      title: text(d.heroMainTitle),
      description: text(d.heroDescription),
      stats: (d.heroStats ?? []).map((stat) => ({
        label: text(stat.statLabel),
        value: parseFloat(text(stat.statNumber)) || 0,
        suffix: text(stat.statSuffix) || undefined,
      })),
    },
    howWeVerify: {
      smallHeading: text(d.howWeVerifySmallHeading),
      title: text(d.howWeVerifyTitle),
      steps: (d.verificationSteps ?? []).map((step) => ({
        title: text(step.stepTitle),
        description: text(step.stepDescription),
      })),
      labPartnerHtml: acfHtml(d.labPartnerNote),
    },
    verifyVial: {
      smallHeading: text(d.verifySectionSmallHeading),
      title: text(d.verifySectionTitle),
      description: text(d.verifySectionDescription),
      helpText: text(d.helpText),
      helpEmail: text(d.helpEmail),
    },
    samples: {
      smallHeading: text(d.sampleCoasSmallHeading),
      title: text(d.sampleCoasTitle),
      description: text(d.sampleCoasDescription),
      items,
    },
  };
}
