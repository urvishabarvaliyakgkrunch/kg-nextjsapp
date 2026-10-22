// src/lib/shopper.ts
// Server-only. Who is signed in, in the shape the Woo cart calls need.

import { getAuthToken } from "@/lib/auth";
import { getCustomer } from "@/lib/queries/account";

export interface Shopper {
  email: string;
  authToken: string;
  // Only set when WordPress has them — Tagada gets whatever is available,
  // same as the plugin's tgd_build_customer() fallback (billing name, then account name)
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// A login token always belongs to the same person, so WordPress is asked only once per token
const PROFILE_TTL_MS = 10 * 60 * 1000;
type ShopperProfile = Omit<Shopper, "authToken">;
const profileByToken = new Map<string, { profile: ShopperProfile; at: number }>();

async function profileFor(authToken: string): Promise<ShopperProfile | null> {
  const hit = profileByToken.get(authToken);
  if (hit && Date.now() - hit.at < PROFILE_TTL_MS) return hit.profile;

  const customer = await getCustomer(authToken);
  if (!customer?.email) return null;

  const profile: ShopperProfile = {
    email: customer.email,
    firstName: customer.billing?.firstName || customer.firstName || undefined,
    lastName: customer.billing?.lastName || customer.lastName || undefined,
    phone: customer.billing?.phone || undefined,
  };

  profileByToken.set(authToken, { profile, at: Date.now() });
  return profile;
}

// WPLoyalty coupons are locked to one account, and WPLoyalty reads the signed-in WordPress
// user while the cart is priced — a guest Cart-Token is never enough, so we send the login too.
export async function getShopper(): Promise<Shopper | null> {
  try {
    const authToken = await getAuthToken();
    if (!authToken) return null;
    const profile = await profileFor(authToken);
    return profile ? { ...profile, authToken } : null;
  } catch {
    return null;
  }
}
