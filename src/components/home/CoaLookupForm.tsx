// src/components/home/CoaLookupForm.tsx
"use client";

import { useState } from "react";
import CoaSearchResults from "@/components/coas/CoaSearchResults";
import { useCoaSearch } from "@/hooks/useCoaSearch";

// Searches products by name or lot number as the visitor types
export default function CoaLookupForm() {
  const [lot, setLot] = useState("");
  const search = useCoaSearch(lot);

  return (
    <div className="mb-5 w-full">
      {/* Results already update while typing, so Enter only has to stop the page reload */}
      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            value={lot}
            onChange={(e) => setLot(e.target.value)}
            placeholder="Lot # (e.g. ELX-2025-0142) Or Product (e.g. GLOW)"
            autoComplete="off"
            aria-label="Lot number or product"
            className="min-w-0 flex-1 rounded-[8px] border border-[#DADADA] bg-white px-[14px] py-[10px] font-display text-[15px] text-ink-dark outline-none transition-[border-color] duration-300 placeholder:text-[#A0A0A0] focus:border-blue"
          />
          <button
            type="submit"
            className="shrink-0 rounded-[8px] bg-black px-5 py-[10px] font-mono text-[13px] font-semibold leading-none tracking-[0.04em] text-white uppercase transition-colors duration-200 hover:bg-[#004ecc]"
          >
            Look up COA
          </button>
        </div>
      </form>

      <CoaSearchResults state={search} query={lot} listClassName="mt-6" />
    </div>
  );
}
