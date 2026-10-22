// src/lib/productMeta.ts
// Flattens the WordPress ACF meta array into the shape the product page sections consume.

import { parsePrice } from "./formatPrice";
import { toCoaHref } from "./coasMapper";
import type {
  ComponentSpec,
  CoaRow,
  FaqItem,
  MetaEntry,
  ProductMeta,
  Reference,
  SpecRow,
} from "@/types/product";

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

// Some products store literature as blank-line-separated text, others as <p> markup.
// Preserve only the inline tags rendered by CompoundProfile.
function literatureParagraphs(html: string): string[] {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/<(?!\/?(strong|em|a)\b)[^>]+>/gi, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim()
    )
    .filter(Boolean);
}

// ACF stores the research areas as a <ul>; the design renders them as its own list
function listItems(html: string): string[] {
  return [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean);
}

// ACF wraps each answer in three divs; only the innermost markup is content
function faqAnswer(html: string): string {
  const inner = html.match(/<div class="faq-a-inner">([\s\S]*?)<\/div>/);
  return (inner ? inner[1] : html).trim();
}

function coaRows(html: string): CoaRow[] {
  const pattern =
    /<span class="label">([\s\S]*?)<\/span><span class="val([^"]*)">([\s\S]*?)<\/span>/g;
  return [...html.matchAll(pattern)].map((m) => ({
    label: stripTags(m[1]),
    pass: m[2].includes("pass-tag"),
    value: stripTags(m[3]),
  }));
}

function specRows(get: (k: string) => string, pairs: [string, string][]): SpecRow[] {
  return pairs
    .map(([label, key]) => ({ label, value: stripTags(get(key)) }))
    .filter((row) => row.value !== "");
}

const COMPONENT_FIELDS: [string, string][] = [
  ["CLASS", "class"],
  ["SEQUENCE", "sequence"],
  ["CAS NUMBER", "cas_number"],
  ["MOLECULAR FORMULA", "molecular_formula"],
  ["MOLECULAR WEIGHT", "molecular_weight"],
  ["PER-COMPONENT PURITY", "per-component_purity"],
];

const BLEND_FIELDS: [string, string][] = [
  ["TOTAL CONTENT", "-blend_total_content"],
  ["FORM", "-blend_form"],
  ["IDENTITY (LC-MS)", "-blend_identity_lc-ms"],
  ["STERILITY / LAL", "-blend_sterility__lal"],
  ["STORAGE", "-blend_storage"],
  ["ORIGIN", "-blend_origin"],
];

function buildComponents(get: (k: string) => string): ComponentSpec[] {
  // Component 1 uses clean keys; component 2 carries the trailing dashes ACF generated
  const first: ComponentSpec = {
    title: get("component_01_tittle"),
    rows: specRows(get, COMPONENT_FIELDS.map(
      ([label, key]) => [label, `component_01_${key}`]
    )),
  };

  const secondKey = (key: string) =>
    key === "class" ? "component_2_class-2" : `component_2_${key}-`;
  const second: ComponentSpec = {
    title: get("component_2_title-"),
    rows: specRows(get, COMPONENT_FIELDS.map(
      ([label, key]) => [label, secondKey(key)]
    )),
  };

  return [first, second].filter((c) => c.title !== "" && c.rows.length > 0);
}

function buildReferences(get: (k: string) => string, count: number): Reference[] {
  return Array.from({ length: count }, (_, i) => ({
    authors: stripTags(get(`product_references_${i}_ref_authors`)),
    journal: stripTags(get(`product_references_${i}_ref_journal`)),
    title: stripTags(get(`product_references_${i}_ref_title`)),
    pubmedId: get(`product_references_${i}_ref_pubmed_id`),
    pubmedUrl: get(`product_references_${i}_ref_pubmed_url`),
  })).filter((r) => r.title !== "");
}

function buildFaqs(get: (k: string) => string, count: number): FaqItem[] {
  return Array.from({ length: count }, (_, i) => ({
    question: get(`faq_${i}_quetion_`),
    answer: faqAnswer(get(`faq_${i}_answer`)),
  })).filter((f) => f.question !== "");
}

export function parseProductMeta(entries: MetaEntry[]): ProductMeta {
  const map = new Map(entries.map((e) => [e.key, e.value ?? ""]));
  const get = (key: string) => (map.get(key) ?? "").trim();
  const count = (key: string) => parseInt(get(key), 10) || 0;

  return {
    lotNumber: get("lot_number"),
    mgPerVial: get("mg_per_vial"),
    blendType: get("blend_type"),
    purityClass: get("class"),
    typeTitle: get("type_title_"),
    basePrice: parsePrice(get("_kg_base_price")),
    compoundProfileTitle: get("compound_profile_title"),
    compoundProfileDescription: get("compound_profile_description_"),
    literatureTitle: get("literature_title"),
    literature: literatureParagraphs(get("the_literature")),
    researchAreas: listItems(get("documented_research_areas")),
    components: buildComponents(get),
    blendRows: specRows(get, BLEND_FIELDS),
    references: buildReferences(get, count("product_references")),
    faqs: buildFaqs(get, count("faq")),
    coaUrl: toCoaHref(get("coas")),
    coaRows: coaRows(get("test")),
  };
}

export interface RelatedCard {
  perVial: string;
  basePrice: number;
  rows: SpecRow[];
}

// Related cards show the undiscounted single-bottle price, same as the live loop grid
export function parseRelatedCard(entries: MetaEntry[]): RelatedCard {
  const map = new Map(entries.map((e) => [e.key, e.value ?? ""]));
  const get = (key: string) => (map.get(key) ?? "").trim();

  return {
    perVial: get("mg_per_vial"),
    basePrice: parsePrice(get("_kg_base_price")),
    rows: specRows(get, [
      ["CAS#", "component_01_cas_number"],
      ["FORMULA", "component_01_molecular_formula"],
      ["M.W.", "component_01_molecular_weight"],
    ]),
  };
}
