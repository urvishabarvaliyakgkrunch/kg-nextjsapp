// src/lib/queries/global.ts
// Site-wide ACF data (top bars, header, footer, research box) — one query, cached for a week.

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { gql } from "@/lib/graphql";
import { toGlobalData } from "@/lib/layoutMapper";
import type { ResearchBoxData } from "@/types/home";
import type { GlobalData, GQLGlobalResponse } from "@/types/layout";

// Clear with /api/revalidate?tag=global-section after editing either options page in WordPress
export const GLOBAL_TAG = "global-section";
// This content almost never changes, so WordPress is asked at most once a week
const ONE_WEEK_SECONDS = 604800;

const IMAGE = "node { sourceUrl altText }";
const LINK = "title url target";

// Two options pages, one request: "Global section" (research box) and "Header Footer Field" (site chrome)
const GLOBAL_QUERY = /* GraphQL */ `
  query GetGlobalData {
    globalSection {
      globalSectionAcf {
        researchBoxSmallHeading
        researchBoxMainHeading
        researchBoxParagraph
      }
    }
    headerFooterField {
      headerFooterFieldsNext {
        announcementBarShow
        announcementBarItems { announcementText }
        disclaimerBarShow
        disclaimerBarText

        headerLogoImage { ${IMAGE} }
        headerMenuLinks { menuLink { ${LINK} } }

        footerLogoImage { ${IMAGE} }
        footerHeadingNormalText
        footerHeadingBlueText
        footerShortDescription
        footerTrustBadges { badgeText badgeIcon }
        footerLinkColumns { columnHeading columnLinks { columnLink { ${LINK} } } }
        footerProductRenameNote
        footerLegalDisclaimerText
        footerCopyrightText
        footerSocialLinks { socialUrl socialPlatform { ${IMAGE} } }
      }
    }
  }
`;

// Kept for a week across every page and visitor. A failed call throws, so it is never stored —
// the fetch cache would have kept a GraphQL error for the whole week.
const fetchGlobalData = unstable_cache(
  () => gql<GQLGlobalResponse>(GLOBAL_QUERY, {}, { noCache: true }),
  ["global-section", GLOBAL_QUERY],
  { revalidate: ONE_WEEK_SECONDS, tags: [GLOBAL_TAG] }
);

// cache() lets the layout and the page share one result within the same request
export const getGlobalData = cache(async (): Promise<GlobalData> => {
  try {
    return toGlobalData(await fetchGlobalData());
  } catch (error) {
    // Site chrome must never take the page down — render empty sections and log why
    console.error("[getGlobalData]", error instanceof Error ? error.message : error);
    return toGlobalData(null);
  }
});

export async function getResearchBox(): Promise<ResearchBoxData | null> {
  return (await getGlobalData()).researchBox;
}
