// src/components/product/ProductRating.tsx

import StarRow from "./StarRow";

interface Props {
  score: number;
  outOf?: number;
  caption: string;
}

export default function ProductRating({ score, outOf = 5, caption }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {/* Live rating fill is #F7BF33 at 20px — not the global --color-star */}
      <StarRow score={score} outOf={outOf} />
      <span className="font-mono text-[12px] font-medium leading-[22px] text-muted-2">
        {score.toFixed(1)} / {outOf}
      </span>
      <span className="basis-full font-mono text-[12px] font-medium leading-[22px] text-muted-2 md:basis-auto">
        {caption}
      </span>
    </div>
  );
}
