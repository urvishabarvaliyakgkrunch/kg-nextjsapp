// src/components/common/ResearchUseOnly.tsx

import type { ResearchBoxData } from "@/types/home";

type ResearchUseOnlyProps = {
  // From the global ACF group — each page fetches it with getResearchBox()
  content: ResearchBoxData;
  // Live inner pages (COAs) use looser mobile heading tracking and full-width copy;
  // policy pages ("legal") put each paragraph in its own widget, 20px apart
  variant?: "home" | "page" | "legal";
};

const COPY_CLASS = {
  home: "max-w-full min-[768px]:max-w-[88%] [&_p]:mb-[15px] [&_p:last-child]:mb-0",
  page: "max-w-full [&_p]:mb-[15px] [&_p:last-child]:mb-0",
  legal: "w-full [&_p]:mb-[14.4px] [&_p:not(:last-child)]:mb-[34.4px]",
};

export default function ResearchUseOnly({ content: box, variant = "home" }: ResearchUseOnlyProps) {
  const headingTracking =
    variant === "page" ? "tracking-[-0.3px] min-[768px]:tracking-[-1.68px]" : "tracking-[-1.68px]";

  return (
    <div className="mx-auto flex max-w-[910px] flex-col gap-5 border-y border-ruo-border bg-ruo-bg px-5 py-[30px] text-center">
      <div>
        {box.smallHeading && (
          <p className="mb-4 mt-2 font-mono text-[11px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue">
            {box.smallHeading}
          </p>
        )}
        <h2
          className={`font-display text-[25px] font-bold leading-[32.5px] text-ink-dark min-[768px]:text-[35px] min-[768px]:leading-[45.5px] min-[1024px]:text-[56px] min-[1024px]:leading-[58px] ${headingTracking}`}
        >
          {box.mainHeading}
        </h2>
      </div>

      {/* WYSIWYG field from WordPress — each <p> gets the live paragraph style */}
      <div
        className={`mx-auto font-sans text-[16px] font-normal leading-[24px] text-lot-body ${COPY_CLASS[variant]}`}
        dangerouslySetInnerHTML={{ __html: box.paragraphHtml }}
      />
    </div>
  );
}
