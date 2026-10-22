// src/lib/queries/faq.ts

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { toFaqPageData } from "@/lib/faqMapper";
import { gql } from "@/lib/graphql";
import type { FaqPageData, GQLFaqPageFields } from "@/types/faq";

// Clear with /api/revalidate?tag=faq-page after editing the FAQ page in WordPress
export const FAQ_PAGE_TAG = "faq-page";
const FAQ_PAGE_SECONDS = 86400;

const FAQ_PAGE_QUERY = /* GraphQL */ `
  query GetFaqPageData {
    page(id: "/faq/", idType: URI) {
      faqPageFieldNext {
        heroSmallHeading
        heroMainTitle
        heroDescription
        faqGroups {
          groupTitle
          questions { question answer }
        }
        closingTitle
        closingText
      }
    }
  }
`;

const fetchFaqPage = unstable_cache(
  () =>
    gql<{ page: { faqPageFieldNext: GQLFaqPageFields | null } | null }>(
      FAQ_PAGE_QUERY,
      {},
      { noCache: true }
    ),
  ["faq-page", FAQ_PAGE_QUERY],
  { revalidate: FAQ_PAGE_SECONDS, tags: [FAQ_PAGE_TAG] }
);

export const getFaqPageData = cache(async (): Promise<FaqPageData> => {
  try {
    const data = await fetchFaqPage();
    return toFaqPageData(data.page?.faqPageFieldNext ?? null);
  } catch (error) {
    // A missing or renamed ACF field must not take /faq down — render empty and log why
    console.error("[getFaqPageData]", error instanceof Error ? error.message : error);
    return toFaqPageData(null);
  }
});
