// src/lib/homeMapper.ts
// Turns the raw ACF response into small section objects, so components never touch null checks.

import { acfHtml, acfMailtoParagraph, acfText as text, toImage, toLinkButton } from "@/lib/helper";
import type { GQLHomePageFields, HomePageData } from "@/types/home";

// The "is pass" field is stored as text, so any yes-like value turns the value green
function isTruthy(value: string | null): boolean {
  return ["1", "true", "yes", "pass"].includes(text(value).toLowerCase());
}

export function toHomePageData(f: GQLHomePageFields | null): HomePageData {
  // Empty object keeps every section safe to read before the admin fills the page
  const d = f ?? ({} as Partial<GQLHomePageFields>);

  return {
    hero: {
      // The pill draws its own gold stars, so typed ★ in the field would show twice
      ratingText: text(d.heroRatingText).replace(/★/g, "").trim(),
      reviewCountText: text(d.heroReviewCountText),
      titleLine1: text(d.heroMainTitleLine1),
      titleLine2: text(d.heroMainTitleLine2),
      titleLine3: text(d.heroMainTitleLine3),
      subtitle: text(d.heroSubtitleText),
      button: toLinkButton(d.heroShopButton),
      desktopImage: toImage(d.heroDesktopBackgroundImage),
      mobileImage: toImage(d.heroMobileBackgroundImage),
      trustItems: (d.heroTrustBarItems ?? []).map((item) => ({
        icon: toImage(item.trustItemIcon),
        text: text(item.trustItemText),
      })),
    },
    featured: {
      smallHeading: text(d.featuredSmallHeading),
      mainHeading: text(d.featuredMainHeading),
      products: d.featuredSelectedProducts?.nodes ?? [],
      bottomNote: text(d.featuredBottomNote),
    },
    different: {
      smallHeading: text(d.differentSmallHeading),
      mainHeading: text(d.differentMainHeading),
      tableLeftLabel: text(d.differentTableLeftLabel),
      features: (d.differentCompareFeatures ?? []).map((row) => ({
        iconSvg: row.compareFeatureIcon?.trim() ?? "",
        name: text(row.compareFeatureName),
      })),
      ourBrand: {
        badge: text(d.differentOurBrandBadge),
        name: text(d.differentOurBrandName),
        subtext: text(d.differentOurBrandSubtext),
        bottleImage: toImage(d.differentOurBottleImage),
      },
      vendor: {
        name: text(d.differentVendorName),
        subtext: text(d.differentVendorSubtext),
        bottleImage: toImage(d.differentVendorBottleImage),
      },
    },
    featuredLot: {
      smallHeading: text(d.lotSmallHeading),
      productTitle: text(d.lotProductTitle),
      purity: parseFloat(text(d.lotPurityPercentage)) || 0,
      description: acfHtml(d.lotDescriptionText),
      specs: (d.lotSpecTableRows ?? []).map((row) => ({
        label: text(row.specLabel),
        value: text(row.specValue),
        isPass: isTruthy(row.specIsPass),
      })),
      videoUrl: text(d.lotRightSideVideo?.node?.mediaItemUrl),
      backgroundImage: toImage(d.lotSectionBackgroundImage),
    },
    framework: {
      smallHeading: text(d.frameworkSmallHeading),
      mainHeading: text(d.frameworkMainHeading),
      testCards: (d.frameworkTestCards ?? []).map((card) => ({
        number: text(card.testCardNumber),
        title: text(card.testCardTitle),
        methodBadge: text(card.testCardMethodBadge),
        description: text(card.testCardDescription),
        iconSvg: card.testCardIcon?.trim() ?? "",
      })),
    },
    coa: {
      leftTitle: text(d.coaLeftBoxTitle),
      leftLabInfo: text(d.coaLeftLabInfoLine),
      reportRows: (d.coaLeftReportRows ?? []).map((row) => ({
        label: text(row.reportRowLabel),
        value: text(row.reportRowValue),
      })),
      rightSmallHeading: text(d.coaRightSmallHeading),
      rightMainHeading: text(d.coaRightMainHeading),
      rightDescription: text(d.coaRightDescription),
      rightBackgroundImage: toImage(d.coaRightBackgroundImage),
      helpTextHtml: acfMailtoParagraph(d.coaHelpTextBeforeEmail),
    },
    journal: {
      smallHeading: text(d.journalSmallHeading),
      mainHeading: text(d.journalMainHeading),
    },
  };
}
