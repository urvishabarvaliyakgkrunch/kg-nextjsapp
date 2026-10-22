// src/lib/queries/contact.ts

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { gql } from "@/lib/graphql";
import { toContactPageData } from "@/lib/contactMapper";
import type { ContactPageData, GQLContactPageFields } from "@/types/contact";

// Clear with /api/revalidate?tag=contact-page after editing the Contact page in WordPress
export const CONTACT_PAGE_TAG = "contact-page";
const CONTACT_PAGE_SECONDS = 86400;

const CONTACT_PAGE_QUERY = /* GraphQL */ `
  query GetContactPageData {
    page(id: "/contact/", idType: URI) {
      contactPageFieldNext {
        heroSmallHeading
        heroMainTitle
        heroDescription
        emailCard { emailIcon email emailDescription }
        phoneCard { phoneIcon phoneNumber phoneDescription }
        locationCard { locationIcon location locationDescription }
      }
    }
  }
`;

// unstable_cache skips failed calls, unlike the fetch cache which would keep a GraphQL error for a day.
// The query text is part of the key, so editing the query drops the old copy automatically.
const fetchContactPage = unstable_cache(
  () =>
    gql<{ page: { contactPageFieldNext: GQLContactPageFields | null } | null }>(
      CONTACT_PAGE_QUERY,
      {},
      { noCache: true }
    ),
  ["contact-page", CONTACT_PAGE_QUERY],
  { revalidate: CONTACT_PAGE_SECONDS, tags: [CONTACT_PAGE_TAG] }
);

// One call for every Contact section; cache() shares it if anything else asks in the same request
export const getContactPageData = cache(async (): Promise<ContactPageData> => {
  const data = await fetchContactPage();
  return toContactPageData(data.page?.contactPageFieldNext ?? null);
});
