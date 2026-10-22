// src/components/research/ResearchSectionHeading.tsx

type ResearchSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function ResearchSectionHeading({
  eyebrow,
  title,
  description,
}: ResearchSectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-5 p-[10px] text-center">
      <div className="w-full max-w-[342px] min-[768px]:max-w-[520px] min-[1025px]:max-w-[779px]">
        <p className="mb-4 mt-2 font-mono text-[11px] font-medium uppercase leading-[18px] tracking-[2.2px] text-blue">
          {eyebrow}
        </p>
        <h2 className="font-display text-[25px] font-bold leading-[32.5px] tracking-[-0.3px] text-ink-dark min-[768px]:text-[45px] min-[768px]:leading-[58.5px] min-[768px]:tracking-[-1.68px] min-[1025px]:text-[56px] min-[1025px]:leading-[58px]">
          {title}
        </h2>
      </div>
      <p className="mb-[14.4px] w-full font-sans text-[16px] font-medium leading-[20.8px] text-muted-2 min-[768px]:max-w-[521px] min-[768px]:leading-[26px] min-[1025px]:max-w-[696px]">
        {description}
      </p>
    </div>
  );
}
