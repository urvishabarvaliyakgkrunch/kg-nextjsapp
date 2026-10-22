// src/components/product/ProductChips.tsx

interface Props {
  items: string[];
  // The purity chip is the proof point, so it swaps the outline for a green fill
  highlight?: string;
}

export default function ProductChips({ items, highlight }: Props) {
  const visible = items.filter(Boolean);
  if (visible.length === 0) return null;

  return (
    <ul className="mb-[20px] flex flex-wrap items-center gap-2.5 md:gap-[20px]">
      {visible.map((item) => {
        const isPurity = item === highlight;
        return (
          <li
            key={item}
            className={`rounded-[100px] px-[15px] py-1.5 font-mono text-[12px] font-normal uppercase leading-[22px] ${
              isPurity
                ? "border border-chip-ok-line bg-chip-ok-bg text-chip-ok"
                : "border border-line text-chip-text"
            }`}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
}