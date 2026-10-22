// src/components/layout/search/SearchResults.tsx
import Link from "next/link";
import HighlightedText from "@/components/layout/search/HighlightedText";
import SearchResultRow from "@/components/layout/search/SearchResultRow";
import SearchResultsSkeleton from "@/components/layout/search/SearchResultsSkeleton";
import type { SearchState } from "@/hooks/useProductSearch";

interface Props {
  state: SearchState;
  // Typed text, passed down so matches can be bold
  query: string;
  onNavigate: () => void;
}

// Small grey heading with a thin line under it, like "CATEGORIES" / "PRODUCTS"
function GroupTitle({ children }: { children: string }) {
  return (
    <h3 className="mx-5 mb-2 border-b border-gray-light pb-1 text-[12px] font-medium uppercase tracking-[0.5px] text-ink">
      {children}
    </h3>
  );
}

export default function SearchResults({ state, query, onNavigate }: Props) {
  // Nothing typed yet (or only one letter): show no panel at all
  if (!state.isActive) return null;

  // Panel wrapper is shared so the skeleton and the results sit in the same box
  const panel = "max-h-[50vh] overflow-y-auto bg-white";

  if (state.isLoading) {
    return (
      <div className={panel}>
        <SearchResultsSkeleton />
      </div>
    );
  }

  const { categories, products } = state.data;

  if (categories.length === 0 && products.length === 0) {
    return (
      <div className={`${panel} px-5 py-6 text-[14px] text-muted-alt`} role="status">
        No results found. Try a compound name or SKU.
      </div>
    );
  }

  return (
    <div className={`${panel} pb-2 pt-4`}>
      {categories.length > 0 && (
        <section className="mb-5">
          <GroupTitle>Categories</GroupTitle>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/product-category/${category.slug}`}
              onClick={onNavigate}
              className="block px-5 py-1.5 text-[15px] font-normal text-ink hover:bg-gray-light"
            >
              <HighlightedText text={category.name} query={query} />
            </Link>
          ))}
        </section>
      )}

      {products.length > 0 && (
        <section>
          <GroupTitle>Products</GroupTitle>
          {products.map((product) => (
            <SearchResultRow key={product.id} product={product} query={query} onNavigate={onNavigate} />
          ))}
        </section>
      )}
    </div>
  );
}
