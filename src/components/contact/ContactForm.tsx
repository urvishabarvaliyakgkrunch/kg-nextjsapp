// src/components/contact/ContactForm.tsx
"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { sendContactAction } from "@/actions/contact";
import type { ContactFormState } from "@/types/contactForm";
import ContactField from "./ContactField";
import ContactStatus from "./ContactStatus";
import ContactSubmit from "./ContactSubmit";

const EMPTY: ContactFormState = {};

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, submit, pending] = useActionState(sendContactAction, EMPTY);

  // Clear the fields only after a successful send, so a failed try keeps what was typed
  useEffect(() => {
    if (state.sent) formRef.current?.reset();
  }, [state.sent]);

  // Not <form action>: React 19 would blank every field after each reply, even on an error
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }

  return (
    <section aria-labelledby="contact-form-title" className="bg-white px-5 min-[768px]:px-10 min-[1025px]:px-[60px]">
      <div className="mx-auto w-full max-w-[1200px] pt-5 min-[768px]:pt-[50px] min-[1025px]:px-[10px]">
        <div className="mx-auto flex w-full flex-col gap-5 min-[768px]:w-[74%] min-[768px]:px-[10px] min-[768px]:pb-10 min-[768px]:pt-[30px]">
          <div>
            <p className="mb-4 mt-2 font-mono text-[11px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue">
              —Send a message
            </p>
            <h2
              id="contact-form-title"
              className="font-display text-[32px] font-bold leading-[40px] tracking-[-1.2px] text-ink-dark min-[768px]:text-[45px] min-[768px]:leading-[58.5px] min-[768px]:tracking-[-1.68px] min-[1025px]:text-[56px] min-[1025px]:leading-[58px]"
            >
              Drop us a line.
            </h2>
          </div>

          <p className="mb-[14.4px] font-sans text-[16px] font-medium leading-[20.8px] text-muted-2 min-[768px]:leading-[26px]">
            Fill out the form below and we’ll get back to you within one business day.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="-mx-[5px] -mb-[27px] flex flex-wrap">
            <ContactField id="contact-name" name="name" label="Name" required autoComplete="name" half />
            <ContactField id="contact-email" name="email" label="Email" type="email" required autoComplete="email" half />
            <ContactField id="contact-phone" name="phone" label="Phone (Optional)" type="tel" autoComplete="tel" />
            <ContactField
              id="contact-message"
              name="message"
              label="Message"
              type="textarea"
              required
              placeholder="Tell us how we can help"
            />
            {/* Bot trap: hidden from people and screen readers, bots fill every field they find */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <ContactStatus state={state} />
            <div className="mb-[27px] px-[5px]">
              <ContactSubmit pending={pending} />
            </div>
          </form>

          <p className="mb-[14.4px] font-mono text-[14px] font-medium leading-[18px] text-muted-2">
            By submitting, you confirm you are 21+ and acknowledge our products are sold strictly for laboratory
            research.
          </p>
        </div>
      </div>
    </section>
  );
}
