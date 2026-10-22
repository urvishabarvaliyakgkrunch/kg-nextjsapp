// src/components/contact/ContactStatus.tsx

import type { ContactFormState } from "@/types/contactForm";

// w-full gives the message its own row; without it the flex form puts it beside the button
const ROW = "mb-[27px] w-full px-[5px]";
const TEXT = "font-sans text-[14px] font-medium leading-[22px]";

// Green box after a send, red line after a failure; nothing before the first try
export default function ContactStatus({ state }: { state: ContactFormState }) {
  if (state.sent) {
    return (
      <div className={ROW}>
        <p role="status" className={`${TEXT} rounded-[8px] bg-green-bg px-4 py-3 text-ink-dark`}>
          Thank you! Your message has been sent. We’ll get back to you within one business day.
        </p>
      </div>
    );
  }
  if (state.error) {
    return (
      <div className={ROW}>
        <p role="alert" className={`${TEXT} text-required`}>
          {state.error}
        </p>
      </div>
    );
  }
  return null;
}
