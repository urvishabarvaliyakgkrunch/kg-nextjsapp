// src/hooks/useRewardsPopup.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { LoyaltyRewardsPopup } from "@/types/loyalty";

type Status = "loading" | "ready" | "error";

export interface RewardsPopupState {
  data: LoyaltyRewardsPopup | null;
  status: Status;
  // Called after a redeem, so the new coupon and the lower balance show up
  reload: () => void;
}

// Loads the popup data only while the popup is open — the cart itself never pays for it
export function useRewardsPopup(): RewardsPopupState {
  const [data, setData] = useState<LoyaltyRewardsPopup | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/loyalty/rewards", { signal: controller.signal, cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Rewards not available");
        return res.json() as Promise<LoyaltyRewardsPopup>;
      })
      .then((result) => {
        setData(result);
        setStatus("ready");
      })
      .catch(() => {
        // An abort is just the popup closing, not a failure
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [reloadKey]);

  return { data, status, reload };
}
