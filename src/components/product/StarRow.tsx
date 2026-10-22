// src/components/product/StarRow.tsx

interface Props {
  score: number;
  outOf?: number;
  // Star width and height in px
  size?: number;
  // Tailwind gap class, so each place can space the stars its own way
  gapClass?: string;
}

// One star shape, shared by the title rating and the review cards
const STAR_PATH =
  "M32 12.967c0-0.474-0.359-0.769-1.077-0.885l-9.654-1.404-4.327-8.75c-0.243-0.526-0.558-0.788-0.942-0.788s-0.699 0.263-0.942 0.788l-4.327 8.75-9.654 1.404c-0.718 0.116-1.077 0.41-1.077 0.885 0 0.269 0.16 0.577 0.481 0.923l7 6.808-1.654 9.615c-0.026 0.18-0.038 0.308-0.038 0.385 0 0.269 0.067 0.497 0.202 0.683s0.336 0.279 0.606 0.279c0.231 0 0.487-0.077 0.769-0.231l8.634-4.539 8.635 4.539c0.27 0.154 0.526 0.231 0.769 0.231 0.257 0 0.452-0.093 0.587-0.279s0.201-0.413 0.201-0.683c0-0.166-0.006-0.295-0.019-0.385l-1.654-9.615 6.981-6.808c0.334-0.333 0.5-0.641 0.5-0.923z";

export default function StarRow({
  score,
  outOf = 5,
  size = 20,
  gapClass = "gap-[10px]",
}: Props) {
  // Whole stars only: 4.6 shows as 5 filled stars
  const filled = Math.round(score);

  return (
    // The number next to the stars says the same thing, so screen readers skip the icons
    <span className={`flex ${gapClass} text-pdp-star`} aria-hidden="true">
      {Array.from({ length: outOf }, (_, i) => (
        <span key={i} className={i < filled ? "opacity-100" : "opacity-25"}>
          <svg height={size} width={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d={STAR_PATH} />
          </svg>
        </span>
      ))}
    </span>
  );
}
