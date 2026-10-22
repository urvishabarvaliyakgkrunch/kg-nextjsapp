// src/lib/queries/legal.ts

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { gql } from "@/lib/graphql";
import { toLegalPageData } from "@/lib/legalMapper";
import type { GQLLegalPageFields, LegalPageData, LegalPageStyle } from "@/types/legal";

// Clear with /api/revalidate?tag=legal-page-<slug> after editing the page in WordPress
export const legalPageTag = (slug: string) => `legal-page-${slug}`;
const LEGAL_PAGE_SECONDS = 86400;

// Privacy, Terms, Shipping and Refund share one ACF group (no hardcoded copy)
const LEGAL_PAGE_QUERY = /* GraphQL */ `
  query GetLegalPageData($uri: ID!) {
    page(id: $uri, idType: URI) {
      legalPageFieldsNext {
        heroSmallHeading
        heroMainTitle
        heroDescription
        lastUpdated
        disclaimer
        sectionsList { title content }
      }
    }
  }
`;

const fetchLegalPage = (slug: string) =>
  unstable_cache(
    () =>
      gql<{ page: { legalPageFieldsNext: GQLLegalPageFields | null } | null }>(
        LEGAL_PAGE_QUERY,
        { uri: `/${slug}/` },
        { noCache: true }
      ),
    ["legal-page", slug, LEGAL_PAGE_QUERY],
    { revalidate: LEGAL_PAGE_SECONDS, tags: [legalPageTag(slug)] }
  )();

export const getLegalPageData = cache(
  async (slug: string, style: LegalPageStyle = "standard"): Promise<LegalPageData> => {
    const data = await fetchLegalPage(slug);
    return toLegalPageData(data.page?.legalPageFieldsNext ?? null, style);
  }
);
