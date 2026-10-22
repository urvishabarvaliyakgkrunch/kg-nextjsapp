// src/types/home.ts

import type { GQLProduct } from "./index";

// ── Raw ACF shapes from WPGraphQL ───────────────
export interface AcfMediaEdge {
  node: { sourceUrl: string | null; mediaItemUrl?: string | null; altText: string | null };
}

export interface AcfLink {
  title: string | null;
  url: string | null;
  target: string | null;
}

// Field names match the "Home Page Field Next" ACF group, camelCased by WPGraphQL
export interface GQLHomePageFields {
  heroRatingText: string | null;
  heroReviewCountText: string | null;
  heroMainTitleLine1: string | null;
  heroMainTitleLine2: string | null;
  heroMainTitleLine3: string | null;
  heroSubtitleText: string | null;
  heroShopButton: AcfLink | null;
  heroDesktopBackgroundImage: AcfMediaEdge | null;
  heroMobileBackgroundImage: AcfMediaEdge | null;
  heroTrustBarItems: { trustItemIcon: AcfMediaEdge | null; trustItemText: string | null }[] | null;

  featuredSmallHeading: string | null;
  featuredMainHeading: string | null;
  featuredSelectedProducts: { nodes: GQLProduct[] } | null;
  featuredBottomNote: string | null;

  differentSmallHeading: string | null;
  differentMainHeading: string | null;
  differentTableLeftLabel: string | null;
  differentCompareFeatures:
    | { compareFeatureIcon: string | null; compareFeatureName: string | null }[]
    | null;
  differentOurBrandBadge: string | null;
  differentOurBrandName: string | null;
  differentOurBrandSubtext: string | null;
  differentOurBottleImage: AcfMediaEdge | null;
  differentVendorName: string | null;
  differentVendorSubtext: string | null;
  differentVendorBottleImage: AcfMediaEdge | null;

  lotSmallHeading: string | null;
  lotProductTitle: string | null;
  lotPurityPercentage: string | null;
  lotDescriptionText: string | null;
  lotSpecTableRows:
    | { specLabel: string | null; specValue: string | null; specIsPass: string | null }[]
    | null;
  lotRightSideVideo: AcfMediaEdge | null;
  lotSectionBackgroundImage: AcfMediaEdge | null;

  frameworkSmallHeading: string | null;
  frameworkMainHeading: string | null;
  frameworkTestCards:
    | {
        testCardNumber: string | null;
        testCardTitle: string | null;
        testCardMethodBadge: string | null;
        testCardDescription: string | null;
        testCardIcon: string | null;
      }[]
    | null;

  coaLeftBoxTitle: string | null;
  coaLeftLabInfoLine: string | null;
  coaLeftReportRows: { reportRowLabel: string | null; reportRowValue: string | null }[] | null;
  coaRightSmallHeading: string | null;
  coaRightMainHeading: string | null;
  coaRightDescription: string | null;
  coaRightBackgroundImage: AcfMediaEdge | null;
  coaHelpTextBeforeEmail: string | null;

  journalSmallHeading: string | null;
  journalMainHeading: string | null;
}

// ── Clean shapes the home components receive ───
export interface MediaImage {
  src: string;
  alt: string;
}

export interface LinkButton {
  label: string;
  href: string;
  target?: string;
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface SectionHeading {
  smallHeading: string;
  mainHeading: string;
}

export interface HeroSectionData {
  ratingText: string;
  reviewCountText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  button: LinkButton | null;
  desktopImage: MediaImage | null;
  mobileImage: MediaImage | null;
  trustItems: { icon: MediaImage | null; text: string }[];
}

export interface FeaturedSectionData extends SectionHeading {
  products: GQLProduct[];
  bottomNote: string;
}

export interface CompareColumn {
  badge?: string;
  name: string;
  subtext: string;
  bottleImage: MediaImage | null;
}

export interface DifferentSectionData extends SectionHeading {
  tableLeftLabel: string;
  // SVG markup pasted into an ACF textarea
  features: { iconSvg: string; name: string }[];
  ourBrand: CompareColumn;
  vendor: CompareColumn;
}

export interface FeaturedLotSectionData {
  smallHeading: string;
  productTitle: string;
  purity: number;
  description: string;
  specs: (LabelValue & { isPass: boolean })[];
  videoUrl: string;
  backgroundImage: MediaImage | null;
}

export interface FrameworkTestCard {
  number: string;
  title: string;
  methodBadge: string;
  description: string;
  // SVG markup pasted into an ACF textarea
  iconSvg: string;
}

export interface FrameworkSectionData extends SectionHeading {
  testCards: FrameworkTestCard[];
}

export interface CoaSectionData {
  leftTitle: string;
  leftLabInfo: string;
  reportRows: LabelValue[];
  rightSmallHeading: string;
  rightMainHeading: string;
  rightDescription: string;
  rightBackgroundImage: MediaImage | null;
  // WYSIWYG HTML — holds the mailto link
  helpTextHtml: string;
}

export interface HomePageData {
  hero: HeroSectionData;
  featured: FeaturedSectionData;
  different: DifferentSectionData;
  featuredLot: FeaturedLotSectionData;
  framework: FrameworkSectionData;
  coa: CoaSectionData;
  journal: SectionHeading;
}

// ── Global "Research Use Only" box ──────────────
export interface ResearchBoxData {
  smallHeading: string;
  mainHeading: string;
  // WYSIWYG HTML from WordPress
  paragraphHtml: string;
}
