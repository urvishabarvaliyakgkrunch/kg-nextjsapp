// src/lib/requireCustomer.ts

import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { getCustomer } from "@/lib/queries/account";
import type { GQLCustomer } from "@/types/account";

// No cookie at all — nothing to fetch, send them straight to the sign-in screen
export async function requireAuthToken(): Promise<string> {
  const authToken = await getAuthToken();
  if (!authToken) redirect("/account");
  return authToken;
}

// WordPress refused the token, so the session is dead even though a cookie exists
export function ensureCustomer(customer: GQLCustomer | null): GQLCustomer {
  if (!customer) redirect("/account");
  return customer;
}

// For pages that need nothing but the customer
export async function requireCustomer(): Promise<{
  authToken: string;
  customer: GQLCustomer;
}> {
  const authToken = await requireAuthToken();
  const customer = await getCustomer(authToken).catch(() => null);
  return { authToken, customer: ensureCustomer(customer) };
}
