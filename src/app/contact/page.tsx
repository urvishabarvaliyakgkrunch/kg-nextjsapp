// src/app/contact/page.tsx

import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import ContactCards from "@/components/contact/ContactCards";
import ContactForm from "@/components/contact/ContactForm";
import ResearchUseOnly from "@/components/common/ResearchUseOnly";
import { getResearchBox } from "@/lib/queries/global";
import { getContactPageData } from "@/lib/queries/contact";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a question about our research peptides? Our team is ready to help. Reach out directly or fill out the form.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  // Independent calls — run side by side, never one after the other
  const [{ hero, cards }, research] = await Promise.all([getContactPageData(), getResearchBox()]);

  return (
    <>
      <section className="border-b border-hero-border bg-white px-[10px] py-[30px] min-[768px]:py-[60px]">
        <PageHero eyebrow={hero.smallHeading} title={hero.title} description={hero.description} />
      </section>
      <ContactCards cards={cards} />
      <ContactForm />
      {research && (
        <section
          aria-label="For research use only"
          className="bg-white px-5 pb-5 pt-5 min-[768px]:px-10 min-[768px]:pb-[50px] min-[1025px]:px-[60px]"
        >
          <ResearchUseOnly content={research} variant="page" />
        </section>
      )}
    </>
  );
}
