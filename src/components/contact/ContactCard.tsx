// src/components/contact/ContactCard.tsx

import type { ContactCardData } from "@/types/contact";

export default function ContactCard({ iconSvg, label, value, href, note }: ContactCardData) {
  const valueClass =
    "font-display text-[13px] font-bold leading-[1.3] text-ink-dark min-[1025px]:text-[19px] min-[1025px]:leading-[23px]";

  return (
    <li className="flex flex-col gap-5 rounded-[12px] border border-field-border p-[30px]">
      <div className="flex flex-col gap-[6px] min-[1025px]:gap-[15px]">
        {/* The pasted SVG has no fill of its own — it takes the text colour from here */}
        <span
          aria-hidden="true"
          className="inline-flex size-[62px] items-center justify-center rounded-[10%] bg-contact-icon-bg text-ink-dark [&_svg]:size-[31px] [&_svg]:fill-current"
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
        <div>
          <h3 className="mb-[6px] mt-2 font-mono text-[14px] font-medium leading-[1.3] text-muted-2 min-[1025px]:mb-4 min-[1025px]:text-[11px] min-[1025px]:leading-[18px]">
            {label}
          </h3>
          {href ? (
            <a href={href} className={`${valueClass} block break-words transition-colors hover:text-blue`}>
              {value}
            </a>
          ) : (
            <p className={valueClass}>{value}</p>
          )}
        </div>
      </div>
      <p className="mb-[14.4px] font-mono text-[14px] font-medium leading-[18px] text-muted-2">{note}</p>
    </li>
  );
}
