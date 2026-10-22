// src/components/layout/search/HeaderSearch.tsx
"use client";

import { useCallback, useState } from "react";
import SearchModal from "@/components/layout/search/SearchModal";
import { SearchIcon } from "@/components/layout/HeaderIcons";

// The magnifier button in the header. The box is mounted only while open,
// so its typed text and results reset every time it is closed.
export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex size-[18px] cursor-pointer before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] items-center justify-center text-ink-dark transition-colors hover:text-blue md:size-5"
        aria-label="Search"
        aria-haspopup="dialog"
      >
        <SearchIcon />
      </button>
      {isOpen && <SearchModal onClose={close} />}
    </>
  );
}
