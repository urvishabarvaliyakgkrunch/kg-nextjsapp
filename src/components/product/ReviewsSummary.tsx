// src/components/product/ReviewsSummary.tsx

import StarRow from "./StarRow";
import { reviewCountLabel } from "@/lib/reviewFormat";

interface Props {
  rating: number;
  count: number;
}

export default function ReviewsSummary({ rating, count }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[32px] font-semibold leading-[40px] text-black">
        {/* One decimal only when needed, so a 3 stays "3" and 4.5 stays "4.5" */}
        {Number(rating.toFixed(1))}
      </span>
      <StarRow score={rating} size={16} gapClass="gap-0.5" />
      <span className="text-[14px] leading-[22px] text-black">
        ({reviewCountLabel(count)})
      </span>
    </div>
  );
}
