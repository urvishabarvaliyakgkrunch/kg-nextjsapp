// src/lib/contactMapper.ts
// Turns the raw Contact page ACF response into section objects, so components never touch null checks.

import { acfHtml, acfText as text } from "@/lib/helper";
import type { ContactCardData, ContactPageData, GQLContactPageFields } from "@/types/contact";

// Card titles are not ACF fields — each card group always holds the same kind of detail
const EMAIL_LABEL = "Email";
const PHONE_LABEL = "Phone";
const LOCATION_LABEL = "Mailing Address";

interface CardSource {
  label: string;
  icon: string | null | undefined;
  value: string | null | undefined;
  note: string | null | undefined;
  // Turns the main text into a link; the address card has none
  toHref?: (value: string) => string;
}

function toCard({ label, icon, value, note, toHref }: CardSource): ContactCardData {
  const cleanValue = text(value);
  return {
    label,
    iconSvg: acfHtml(icon),
    value: cleanValue,
    href: cleanValue && toHref ? toHref(cleanValue) : "",
    note: text(note),
  };
}

export function toContactPageData(f: GQLContactPageFields | null): ContactPageData {
  // Empty object keeps every section safe to read before the admin fills the page
  const d = f ?? ({} as Partial<GQLContactPageFields>);

  const cards = [
    toCard({
      label: EMAIL_LABEL,
      icon: d.emailCard?.emailIcon,
      value: d.emailCard?.email,
      note: d.emailCard?.emailDescription,
      toHref: (email) => `mailto:${email}`,
    }),
    toCard({
      label: PHONE_LABEL,
      icon: d.phoneCard?.phoneIcon,
      value: d.phoneCard?.phoneNumber,
      note: d.phoneCard?.phoneDescription,
      // tel: links break on spaces and dashes
      toHref: (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`,
    }),
    toCard({
      label: LOCATION_LABEL,
      icon: d.locationCard?.locationIcon,
      value: d.locationCard?.location,
      note: d.locationCard?.locationDescription,
    }),
  ];

  return {
    hero: {
      smallHeading: text(d.heroSmallHeading),
      title: text(d.heroMainTitle),
      description: text(d.heroDescription),
    },
    // A card with no main text has nothing to show
    cards: cards.filter((card) => card.value),
  };
}
