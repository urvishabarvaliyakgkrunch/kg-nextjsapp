// src/components/research/ArticlesNotifyCta.tsx

import { ArrowRightIcon } from "@/components/contact/ContactIcons";
import type { ResearchPageData } from "@/types/research";

type ArticlesNotifyCtaProps = {
  text: string;
  button: ResearchPageData["articles"]["notifyButton"];
};

export default function ArticlesNotifyCta({ text, button }: ArticlesNotifyCtaProps) {
  if (!text && !button) return null;

  return (
    <div className="rounded-[12px] border border-field-border bg-white p-[30px]">
      <div className="flex flex-wrap items-center justify-between gap-5 p-[10px]">
        <p className="font-sans text-[16px] font-medium leading-[20.8px] text-black min-[768px]:leading-[26px]">
          {text}
        </p>
        {button && (
          <a
            href={button.href}
            target={button.target}
            rel={button.target === "_blank" ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-[5px] rounded-[7px] bg-ink-dark px-6 py-3 font-sans text-[14px] font-medium leading-[22px] text-white transition-colors hover:bg-blue"
          >
            {button.label}
            <ArrowRightIcon className="size-[14px]" />
          </a>
        )}
      </div>
    </div>
  );
}
