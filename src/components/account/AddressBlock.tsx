// src/components/account/AddressBlock.tsx

import type { GQLAddress } from "@/types/account";

// Prints an address the way a shipping label reads, skipping the empty lines
export default function AddressBlock({ address }: { address: GQLAddress | null }) {
  const lines = [
    [address?.firstName, address?.lastName].filter(Boolean).join(" "),
    address?.company,
    address?.address1,
    address?.address2,
    [address?.city, address?.state, address?.postcode].filter(Boolean).join(", "),
    address?.country,
    address?.phone,
    address?.email,
  ].filter((line): line is string => Boolean(line && line.trim()));

  if (lines.length === 0) {
    return (
      <p className="font-mono text-[14px] italic text-ink">
        You have not set up this type of address yet.
      </p>
    );
  }

  return (
    <address className="flex flex-col gap-0.5 font-mono text-[14px] not-italic text-ink">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </address>
  );
}
