// src/types/contact.ts

// ── Raw ACF shapes from WPGraphQL ───────────────
// Field names match the "Contact Page Field Next" ACF group, camelCased by WPGraphQL
export interface GQLContactPageFields {
  heroSmallHeading: string | null;
  heroMainTitle: string | null;
  heroDescription: string | null;
  emailCard: { emailIcon: string | null; email: string | null; emailDescription: string | null } | null;
  phoneCard: { phoneIcon: string | null; phoneNumber: string | null; phoneDescription: string | null } | null;
  locationCard: {
    locationIcon: string | null;
    location: string | null;
    locationDescription: string | null;
  } | null;
}

// ── Clean shapes the Contact components receive ─
export interface ContactCardData {
  label: string;
  // SVG markup pasted into an ACF textarea
  iconSvg: string;
  value: string;
  // mailto:/tel: link; the address card has none
  href: string;
  note: string;
}

export interface ContactPageData {
  hero: { smallHeading: string; title: string; description: string };
  cards: ContactCardData[];
}
