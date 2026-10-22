// src/components/coas/SampleCoaCard.tsx

import type { SampleCoaItem } from "@/types/coas";

export default function SampleCoaCard({ index, name, dose, tags, href }: SampleCoaItem) {
  return (
    <li className="my-[10px] flex flex-col rounded-[12px] border border-field-border p-[10px] transition-[border-color,box-shadow] duration-300 hover:border-blue hover:shadow-[0_0_10px_0_rgba(1,101,255,0.49)] min-[768px]:flex-row min-[768px]:items-center min-[768px]:gap-5">
      <span className="mb-4 mt-2 p-[10px] font-mono text-[20px] font-bold uppercase leading-[26px] tracking-[2.2px] text-blue min-[768px]:my-0 min-[768px]:w-[10%] min-[768px]:shrink-0 min-[768px]:leading-[28px]">
        {index}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-[10px]">
        <h3 className="mb-[6px] mt-2 font-display text-[20px] font-bold leading-[26px] tracking-[-0.44px] text-ink-dark min-[768px]:my-0 min-[768px]:text-[13px] min-[768px]:leading-[1.3em] min-[1025px]:text-[22px] min-[1025px]:leading-[23.5px] h-[47px]">
          {name}
        </h3>
        <ul className="flex flex-wrap items-center gap-x-4 font-mono text-[14px] font-medium leading-[18px] text-ink-dark min-[768px]:text-[11px]">
          <li>{dose}</li>
          {tags.map((tag) => (
            <li key={tag} className="flex items-center gap-[5px]">
              <span className="size-[4px] shrink-0 rounded-full bg-blue" aria-hidden="true" />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-[6px] mt-3 flex items-center justify-end gap-[5px] px-[10px] py-3 font-mono text-[16px] font-semibold uppercase leading-[18px] text-blue transition-colors hover:text-blue-hover min-[768px]:my-0 min-[768px]:ml-auto min-[768px]:py-[10px] min-[768px]:text-[10px] min-[1025px]:text-[13px]"
        >
          View Sample COA
          <svg viewBox="0 0 32 32" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M30.966 16.234l-9.6-9.6c-0.312-0.312-0.819-0.312-1.131 0s-0.312 0.819 0 1.131l8.234 8.234h-26.069c-0.442 0-0.8 0.358-0.8 0.8s0.358 0.8 0.8 0.8h26.069l-8.234 8.234c-0.312 0.312-0.312 0.819 0 1.131 0.156 0.156 0.361 0.234 0.566 0.234s0.409-0.078 0.566-0.234l9.6-9.6c0.312-0.312 0.312-0.819 0-1.131z" />
          </svg>
        </a>
      )}
    </li>
  );
}
