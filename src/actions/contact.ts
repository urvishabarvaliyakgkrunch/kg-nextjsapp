// src/actions/contact.ts
"use server";

import { ContactSendError, sendContactMessage } from "@/lib/contactApi";
import { isEmail, readField } from "@/lib/validate";
import type { ContactFormState } from "@/types/contactForm";

const GENERIC_ERROR = "We could not send your message. Please try again.";

export async function sendContactAction(_prev: ContactFormState, form: FormData): Promise<ContactFormState> {
  // Real visitors never see this hidden field, so a filled one means a bot. Pretend it worked.
  if (readField(form, "website")) return { sent: true };

  const values = {
    name: readField(form, "name"),
    email: readField(form, "email"),
    phone: readField(form, "phone"),
    message: readField(form, "message"),
  };

  if (!values.name || !values.message) return { error: "Please fill in your name and message." };
  if (!isEmail(values.email)) return { error: "Please enter a valid email address." };

  try {
    await sendContactMessage(values);
  } catch (error) {
    // Our own errors are already worded for the visitor; anything else is not
    return { error: error instanceof ContactSendError ? error.message : GENERIC_ERROR };
  }

  return { sent: true };
}
