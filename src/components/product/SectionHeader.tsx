// src/components/product/SectionHeader.tsx

interface Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  descriptionSize?: "sm" | "md";
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  descriptionSize = "md",
}: Props) {
  return (
    <header className="flex flex-col gap-5 p-[10px]">
      {eyebrow && (
        <p className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase leading-[14px] text-blue">
          <span className="block h-px w-[44px] max-w-[34%] bg-blue" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-display text-[32px] font-bold leading-[40px] text-ink-dark min-[769px]:text-[42px] min-[769px]:leading-[50px] min-[1025px]:text-[72px] min-[1025px]:leading-[75px]">
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`max-w-[530px] font-medium text-muted-2 ${
            descriptionSize === "sm"
              ? "max-w-[492px] text-[14px] leading-[18px] text-lot-body"
              : "text-[16px] leading-[22px]"
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}