// src/lib/contactApi.ts
// The only place that talks to Contact Form 7. Contact Form 7 saves the message (Flamingo) and sends the mail.

import type { Cf7FeedbackResponse, ContactFormValues } from "@/types/contactForm";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
// The numeric id of the form in WP Admin → Contact → Contact Forms
const FORM_ID = process.env.CF7_CONTACT_FORM_ID;

// Our field names on the left, the names used inside the Contact Form 7 form on the right
const CF7_FIELDS: Record<keyof ContactFormValues, string> = {
  name: "your-name",
  email: "your-email",
  phone: "your-phone",
  message: "your-message",
};

export class ContactSendError extends Error {}

export async function sendContactMessage(values: ContactFormValues): Promise<void> {
  if (!WP_URL || !FORM_ID) {
    throw new ContactSendError("Contact form is not set up yet.");
  }

  // Contact Form 7 only accepts multipart form data, not JSON
  const body = new FormData();
  (Object.keys(CF7_FIELDS) as (keyof ContactFormValues)[]).forEach((key) => {
    body.append(CF7_FIELDS[key], values[key]);
  });
  // Contact Form 7 rejects the request without a unit tag; p0 means "not placed on a WP page"
  body.append("_wpcf7_unit_tag", `wpcf7-f${FORM_ID}-p0-o1`);

  const response = await fetch(`${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${FORM_ID}/feedback`, {
    method: "POST",
    body,
    // A message must never come from a cached answer
    cache: "no-store",
  });
  const result = (await response.json().catch(() => ({}))) as Cf7FeedbackResponse;

  if (result.status !== "mail_sent") {
    throw new ContactSendError(result.message || "We could not send your message. Please try again.");
  }
}
