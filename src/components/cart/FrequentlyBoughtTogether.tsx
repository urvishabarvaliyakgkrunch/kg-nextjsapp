// src/components/cart/FrequentlyBoughtTogether.tsx
"use client";

import { useFbtSuggestions } from "@/hooks/useFbtSuggestions";
import FbtItem from "./FbtItem";
import FbtSkeleton from "./FbtSkeleton";

export default function FrequentlyBoughtTogether() {
  const { suggestions, isLoading } = useFbtSuggestions();

  // Nothing to suggest means no block at all, same as the WordPress version
  if (!isLoading && suggestions.length === 0) return null;

  return (
    <section className="relative border-t-2 border-fbt-line bg-white p-4">
      <h3 className="mb-3 font-mono text-[14px] font-medium leading-[16.8px] tracking-[0.28px] text-dark">
        Frequently Bought Together
      </h3>

      {isLoading ? (
        <FbtSkeleton />
      ) : (
        <div className="flex flex-col gap-2.5">
          {suggestions.map((s) => (
            <FbtItem key={s.productId} suggestion={s} />
          ))}
        </div>
      )}
    </section>
  );
}
