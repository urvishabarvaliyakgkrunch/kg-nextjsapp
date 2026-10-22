// src/components/account/OrderStatusBadge.tsx

import { statusLabel, statusTone } from "@/lib/order";

const TONE_CLASS: Record<string, string> = {
  ok: "border-chip-ok-line bg-chip-ok-bg text-chip-ok",
  busy: "border-blue/30 bg-blue-bg text-blue",
  bad: "border-cmp-cross-line bg-cmp-cross-tint text-cmp-cross",
  neutral: "border-line bg-cream text-muted-alt",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 font-mono text-[14px] leading-[21px] ${
        TONE_CLASS[statusTone(status)]
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
