// src/lib/layoutMapper.ts
// Turns the raw global ACF response into small objects for the bars, header, footer and research box.

import { acfHtml, acfText as text, toImage, toLinkButton } from "@/lib/helper";
import type { LinkButton } from "@/types/home";
import type { GQLGlobalResponse, GlobalData } from "@/types/layout";

// "Show" switches default to on — a bar hides only when the admin turns it off
function isTurnedOff(value: string | null | undefined): boolean {
  return ["0", "false", "no", "off"].includes(text(value).toLowerCase());
}

const isLink = (link: LinkButton | null): link is LinkButton => Boolean(link?.label);

export function toGlobalData(data: GQLGlobalResponse | null): GlobalData {
  const d = data?.headerFooterField?.headerFooterFieldsNext ?? null;
  const box = data?.globalSection?.globalSectionAcf ?? null;

  return {
    topBars: {
      announcementItems: isTurnedOff(d?.announcementBarShow)
        ? []
        : (d?.announcementBarItems ?? []).map((item) => text(item.announcementText)).filter(Boolean),
      disclaimerText: isTurnedOff(d?.disclaimerBarShow) ? "" : text(d?.disclaimerBarText),
    },
    header: {
      logo: toImage(d?.headerLogoImage),
      menuLinks: (d?.headerMenuLinks ?? []).map((row) => toLinkButton(row.menuLink)).filter(isLink),
    },
    footer: {
      logo: toImage(d?.footerLogoImage),
      headingNormal: text(d?.footerHeadingNormalText),
      headingBlue: text(d?.footerHeadingBlueText),
      description: text(d?.footerShortDescription),
      trustBadges: (d?.footerTrustBadges ?? []).map((badge) => ({
        iconSvg: acfHtml(badge.badgeIcon),
        text: text(badge.badgeText),
      })),
      columns: (d?.footerLinkColumns ?? []).map((column) => ({
        heading: text(column.columnHeading),
        links: (column.columnLinks ?? []).map((row) => toLinkButton(row.columnLink)).filter(isLink),
      })),
      renameNote: text(d?.footerProductRenameNote),
      legalText: text(d?.footerLegalDisclaimerText),
      copyright: text(d?.footerCopyrightText),
      socialLinks: (d?.footerSocialLinks ?? [])
        .map((row) => ({ icon: toImage(row.socialPlatform), url: text(row.socialUrl) }))
        .filter((row) => row.url),
    },
    researchBox: box?.researchBoxMainHeading
      ? {
          smallHeading: text(box.researchBoxSmallHeading),
          mainHeading: text(box.researchBoxMainHeading),
          paragraphHtml: acfHtml(box.researchBoxParagraph),
        }
      : null,
  };
}
