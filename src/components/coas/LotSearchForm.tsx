// src/components/coas/LotSearchForm.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CoaSearchResults from "@/components/coas/CoaSearchResults";
import { useCoaSearch } from "@/hooks/useCoaSearch";

// Searches products by name or lot number as the visitor types
export default function LotSearchForm() {
  const lotParam = useSearchParams().get("lot") ?? "";
  const [query, setQuery] = useState(lotParam);
  const search = useCoaSearch(query);

  return (
    <>
      {/* Results already update while typing, so Enter only has to stop the page reload */}
      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <label htmlFor="lot-search-input" className="mb-2 block font-display text-[14px] font-bold leading-[14px] text-field-label">
          Search by Lot Number/Product Name
        </label>
        <div className="flex gap-2">
          <input
            id="lot-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter lot number e.g. 21037 or Product Name"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-[8px] border border-field-border bg-white px-[14px] py-[10px] font-display text-[15px] outline-none transition-[border-color] duration-300 placeholder:text-[#757575] focus:border-blue"
          />
          <button
            type="submit"
            className="rounded-[8px] bg-blue px-5 py-[10px] font-mono text-[13px] font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-hover"
          >
            Search
          </button>
        </div>
      </form>

      <CoaSearchResults state={search} query={query} listClassName="md:mt-6" />
    </>
  );
}
