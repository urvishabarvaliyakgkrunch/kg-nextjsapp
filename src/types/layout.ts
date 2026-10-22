// src/types/layout.ts

import type { AcfLink, AcfMediaEdge, LinkButton, MediaImage, ResearchBoxData } from "./home";

// ── Raw ACF shape: "Header Footer Fields Next" group on the "Header Footer Field" options page ──
export interface GQLHeaderFooterFields {
  announcementBarShow: string | null;
  announcementBarItems: { announcementText: string | null }[] | null;
  disclaimerBarShow: string | null;
  disclaimerBarText: string | null;

  headerLogoImage: AcfMediaEdge | null;
  headerMenuLinks: { menuLink: AcfLink | null }[] | null;

  footerLogoImage: AcfMediaEdge | null;
  footerHeadingNormalText: string | null;
  footerHeadingBlueText: string | null;
  footerShortDescription: string | null;
  // badgeIcon is SVG markup pasted into a textarea
  footerTrustBadges: { badgeIcon: string | null; badgeText: string | null }[] | null;
  footerLinkColumns:
    | { columnHeading: string | null; columnLinks: { columnLink: AcfLink | null }[] | null }[]
    | null;
  footerProductRenameNote: string | null;
  footerLegalDisclaimerText: string | null;
  footerCopyrightText: string | null;
  footerSocialLinks: { socialPlatform: AcfMediaEdge | null; socialUrl: string | null }[] | null;
}

export interface GQLResearchBoxFields {
  researchBoxSmallHeading: string | null;
  researchBoxMainHeading: string | null;
  researchBoxParagraph: string | null;
}

export interface GQLGlobalResponse {
  globalSection: { globalSectionAcf: GQLResearchBoxFields | null } | null;
  headerFooterField: { headerFooterFieldsNext: GQLHeaderFooterFields | null } | null;
}

// ── Clean shapes the layout components receive ──
export interface TopBarsData {
  announcementItems: string[];
  disclaimerText: string;
}

export interface HeaderData {
  logo: MediaImage | null;
  menuLinks: LinkButton[];
}

export interface FooterData {
  logo: MediaImage | null;
  headingNormal: string;
  headingBlue: string;
  description: string;
  trustBadges: { iconSvg: string; text: string }[];
  columns: { heading: string; links: LinkButton[] }[];
  renameNote: string;
  legalText: string;
  copyright: string;
  socialLinks: { icon: MediaImage | null; url: string }[];
}

export interface GlobalData {
  topBars: TopBarsData;
  header: HeaderData;
  footer: FooterData;
  researchBox: ResearchBoxData | null;
}
