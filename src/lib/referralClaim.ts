// src/lib/referralClaim.ts
// Server-only. Hands a remembered friend code to WordPress once the shopper has an account.

import { cookies } from "next/headers";
import { claimReferral } from "@/lib/loyalty";
import { REFERRAL_COOKIE } from "@/lib/referralCookie";

// WordPress decides who counts as a new customer, so a failed claim never blocks sign-up
export async function claimPendingReferral(authToken: string): Promise<void> {
  const jar = await cookies();
  const code = jar.get(REFERRAL_COOKIE)?.value;
  if (!code) {
    console.info("[referral] no elx_ref cookie at sign-up");
    return;
  }

  const result = await claimReferral(authToken, code);
  // Visible in the dev terminal so a missing bonus can be traced (null = WordPress refused)
  console.info("[referral] claim", code, result);
  jar.delete(REFERRAL_COOKIE);
}
