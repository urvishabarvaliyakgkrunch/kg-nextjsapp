// src/lib/queries/coas.ts

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { gql, PRODUCTS_TAG } from "@/lib/graphql";
import { COA_PRODUCT_META_KEYS, toCoasPageData } from "@/lib/coasMapper";
import type { CoasPageData, GQLCoasPageFields } from "@/types/coas";

// Clear with /api/revalidate?tag=coas-page after editing the COAs page in WordPress
export const COAS_PAGE_TAG = "coas-page";
const COAS_PAGE_SECONDS = 86400;

const COAS_PAGE_QUERY = /* GraphQL */ `
  query GetCoasPageData {
    page(id: "/coas/", idType: URI) {
      coaPageFieldNext {
        # Elementor swaps the whole page into the FIRST WYSIWYG field of a request — this alias takes that hit
        elementorSink: labPartnerNote

        heroSmallHeading
        heroMainTitle
        heroDescription
        heroStats { statLabel statNumber statSuffix }

        howWeVerifySmallHeading
        howWeVerifyTitle
        verificationSteps { stepTitle stepDescription }
        labPartnerNote

        verifySectionSmallHeading
        verifySectionTitle
        verifySectionDescription
        helpText
        helpEmail

        sampleCoasSmallHeading
        sampleCoasTitle
        sampleCoasDescription
        coasProductSelect(first: 50) {
          nodes {
            ... on Product {
              databaseId
              name
              metaData(keysIn: ${JSON.stringify(COA_PRODUCT_META_KEYS)}) { key value }
            }
          }
        }
      }
    }
  }
`;

// unstable_cache skips failed calls, unlike the fetch cache which would keep a GraphQL error for a day.
// The query text is part of the key, so editing the query drops the old copy automatically.
const fetchCoasPage = unstable_cache(
  () =>
    gql<{ page: { coaPageFieldNext: GQLCoasPageFields | null } | null }>(
      COAS_PAGE_QUERY,
      {},
      { noCache: true }
    ),
  ["coas-page", COAS_PAGE_QUERY],
  // products tag lets a catalog refresh pick up a changed COA PDF too
  { revalidate: COAS_PAGE_SECONDS, tags: [COAS_PAGE_TAG, PRODUCTS_TAG] }
);

// One call for every COAs section; cache() shares it if anything else asks in the same request
export const getCoasPageData = cache(async (): Promise<CoasPageData> => {
  const data = await fetchCoasPage();
  return toCoasPageData(data.page?.coaPageFieldNext ?? null);
});
