// src/components/contact/ContactSubmit.tsx

import Spinner from "@/components/ui/Spinner";
import { ArrowRightIcon } from "./ContactIcons";

// Disabled while sending so a double click cannot send the message twice
export default function ContactSubmit({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center gap-[5px] rounded-[3px] bg-ink-dark px-6 font-sans text-[14px] font-medium leading-[22px] text-white transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Spinner className="size-[14px] border-2" label="Sending message" /> : null}
      {pending ? "Sending…" : "Send message"}
      {pending ? null : <ArrowRightIcon className="size-[14px]" />}
    </button>
  );
}
