// src/lib/queries/verification.ts

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { gql } from "@/lib/graphql";
import { toVerificationPageData } from "@/lib/verificationMapper";
import type { GQLVerificationPageFields, VerificationPageData } from "@/types/verification";

// Clear with /api/revalidate?tag=verification-page-<slug> after editing the page in WordPress
export const verificationPageTag = (slug: string) => `verification-page-${slug}`;
const VERIFICATION_PAGE_SECONDS = 86400;

// Lab Partner, Test Methods and Quality Standards share one ACF group (no hardcoded copy)
const VERIFICATION_PAGE_QUERY = /* GraphQL */ `
  query GetVerificationPageData($uri: ID!) {
    page(id: $uri, idType: URI) {
      verificationPageFieldNext {
        heroSmallHeading
        heroMainTitle
        heroDescription
        sectionsList { title content }
      }
    }
  }
`;

const fetchVerificationPage = (slug: string) =>
  unstable_cache(
    () =>
      gql<{ page: { verificationPageFieldNext: GQLVerificationPageFields | null } | null }>(
        VERIFICATION_PAGE_QUERY,
        { uri: `/${slug}/` },
        { noCache: true }
      ),
    ["verification-page", slug, VERIFICATION_PAGE_QUERY],
    { revalidate: VERIFICATION_PAGE_SECONDS, tags: [verificationPageTag(slug)] }
  )();

export const getVerificationPageData = cache(
  async (slug: string): Promise<VerificationPageData> => {
    const data = await fetchVerificationPage(slug);
    return toVerificationPageData(data.page?.verificationPageFieldNext ?? null);
  }
);
