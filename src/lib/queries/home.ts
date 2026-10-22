// src/lib/queries/home.ts

import { unstable_cache } from "next/cache";
import { gql, PRODUCTS_TAG } from "@/lib/graphql";
import { toHomePageData } from "@/lib/homeMapper";
import { PRODUCT_CARD_FIELDS } from "./fragments";
import type { GQLHomePageFields, HomePageData } from "@/types/home";

// Clear with /api/revalidate?tag=home-page after editing the Home page in WordPress
export const HOME_PAGE_TAG = "home-page";
const HOME_PAGE_SECONDS = 86400;

const IMAGE = "node { sourceUrl altText }";

const HOME_PAGE_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FIELDS}

  query GetHomePageData {
    page(id: "/", idType: URI) {
      homePageFieldNext {
        heroRatingText
        heroReviewCountText
        heroMainTitleLine1
        heroMainTitleLine2
        heroMainTitleLine3
        heroSubtitleText
        heroShopButton { title url target }
        heroDesktopBackgroundImage { ${IMAGE} }
        heroMobileBackgroundImage { ${IMAGE} }
        heroTrustBarItems { trustItemText trustItemIcon { ${IMAGE} } }

        featuredSmallHeading
        featuredMainHeading
        featuredBottomNote
        featuredSelectedProducts { nodes { ...ProductCardFields } }

        differentSmallHeading
        differentMainHeading
        differentTableLeftLabel
        differentCompareFeatures { compareFeatureName compareFeatureIcon }
        differentOurBrandBadge
        differentOurBrandName
        differentOurBrandSubtext
        differentOurBottleImage {node { sourceUrl(size: MEDIUM) altText }}
        differentVendorName
        differentVendorSubtext
        differentVendorBottleImage {node { sourceUrl(size: MEDIUM) altText }}

        lotSmallHeading
        lotProductTitle
        lotPurityPercentage
        lotDescriptionText
        lotSpecTableRows { specLabel specValue specIsPass }
        lotRightSideVideo { node { mediaItemUrl } }
        lotSectionBackgroundImage { ${IMAGE} }

        frameworkSmallHeading
        frameworkMainHeading
        frameworkTestCards {
          testCardNumber
          testCardTitle
          testCardMethodBadge
          testCardDescription
          testCardIcon
        }

        coaLeftBoxTitle
        coaLeftLabInfoLine
        coaLeftReportRows { reportRowLabel reportRowValue }
        coaRightSmallHeading
        coaRightMainHeading
        coaRightDescription
        coaRightBackgroundImage { ${IMAGE} }
        coaHelpTextBeforeEmail

        journalSmallHeading
        journalMainHeading
      }
    }
  }
`;

// unstable_cache skips failed calls, unlike the fetch cache which would keep a GraphQL error for a day.
// The query text is part of the key, so editing the query drops the old copy automatically.
const fetchHomePage = unstable_cache(
  () =>
    gql<{ page: { homePageFieldNext: GQLHomePageFields | null } | null }>(
      HOME_PAGE_QUERY,
      {},
      { noCache: true }
    ),
  ["home-page", HOME_PAGE_QUERY],
  // products tag lets a catalog refresh update the featured prices here too
  { revalidate: HOME_PAGE_SECONDS, tags: [HOME_PAGE_TAG, PRODUCTS_TAG] }
);

// One call for every home section
export async function getHomePageData(): Promise<HomePageData> {
  const data = await fetchHomePage();
  return toHomePageData(data.page?.homePageFieldNext ?? null);
}
