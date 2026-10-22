// src/lib/queries/research.ts

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { gql, PRODUCTS_TAG } from "@/lib/graphql";
import { toResearchPageData } from "@/lib/researchMapper";
import type { GQLResearchPageFields, ResearchPageData } from "@/types/research";

// Clear with /api/revalidate?tag=research-page after editing the Research page in WordPress
export const RESEARCH_PAGE_TAG = "research-page";
const RESEARCH_PAGE_SECONDS = 86400;

const RESEARCH_PAGE_QUERY = /* GraphQL */ `
  query GetResearchPageData {
    page(id: "/research/", idType: URI) {
      researchPageFieldNext {
        heroSmallHeading
        heroMainTitle
        heroDescription

        articlesSmallHeading
        articlesTitle
        articlesDescription
        articlesList { articleCategory articleTitle articleSummary statusLabel }
        notifyText
        notifyButton { url title target }

        literatureSmallHeading
        literatureTitle
        literatureDescription
        literatureCompounds {
          literatureProduct(first: 1) {
            nodes {
              ... on Product {
                name
                uri
              }
            }
          }
          compoundStudiesList {
            studyAuthorYear
            studyJournal
            studyTitle
            studyPubmedId
            studyPubmedUrl
          }
        }
      }
    }
  }
`;

// unstable_cache skips failed calls, unlike the fetch cache which would keep a GraphQL error for a day.
// The query text is part of the key, so editing the query drops the old copy automatically.
const fetchResearchPage = unstable_cache(
  () =>
    gql<{ page: { researchPageFieldNext: GQLResearchPageFields | null } | null }>(
      RESEARCH_PAGE_QUERY,
      {},
      { noCache: true }
    ),
  ["research-page", RESEARCH_PAGE_QUERY],
  // products tag lets a renamed product show up on the cards too
  { revalidate: RESEARCH_PAGE_SECONDS, tags: [RESEARCH_PAGE_TAG, PRODUCTS_TAG] }
);

// One call for every Research section; cache() shares it if anything else asks in the same request
export const getResearchPageData = cache(async (): Promise<ResearchPageData> => {
  const data = await fetchResearchPage();
  return toResearchPageData(data.page?.researchPageFieldNext ?? null);
});
