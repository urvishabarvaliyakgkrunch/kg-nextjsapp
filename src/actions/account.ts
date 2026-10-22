// src/actions/account.ts
"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken, login } from "@/lib/auth";
import { getCustomer, updateCustomer } from "@/lib/queries/account";
import { isEmail, passwordProblem, readField, toErrorMessage } from "@/lib/validate";
import type { FormState } from "@/types/account";

const SIGNED_OUT: FormState = { error: "Your session expired. Please sign in again." };

// Name + email + optional password change — the Woo "Account details" tab
export async function updateDetailsAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const authToken = await getAuthToken({ persist: true });
  if (!authToken) return SIGNED_OUT;

  const firstName = readField(form, "firstName");
  const lastName = readField(form, "lastName");
  const displayName = readField(form, "displayName");
  const email = readField(form, "email");
  const currentPassword = readField(form, "currentPassword");
  const password = readField(form, "password");
  const confirm = readField(form, "confirmPassword");

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = "Enter your first name.";
  if (!lastName) fieldErrors.lastName = "Enter your last name.";
  if (!displayName) fieldErrors.displayName = "Enter a display name.";
  if (!isEmail(email)) fieldErrors.email = "Enter a valid email address.";

  // All three password boxes are optional — only check them once one is filled in
  const changingPassword = Boolean(currentPassword || password || confirm);
  if (changingPassword) {
    if (!currentPassword) fieldErrors.currentPassword = "Enter your current password.";
    const problem = passwordProblem(password);
    if (problem) fieldErrors.password = problem;
    if (password !== confirm) fieldErrors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const customer = await getCustomer(authToken).catch(() => null);
  if (!customer) return SIGNED_OUT;

  // Woo asks for the current password before changing it, so prove it the same way
  if (changingPassword) {
    try {
      await login(customer.username ?? customer.email ?? "", currentPassword);
    } catch {
      return { fieldErrors: { currentPassword: "That is not your current password." } };
    }
  }

  const input: Record<string, unknown> = { firstName, lastName, displayName, email };
  if (changingPassword) input.password = password;

  try {
    await updateCustomer(authToken, input);
  } catch (error) {
    return { error: toErrorMessage(error, "Could not save your details.") };
  }

  revalidatePath("/account", "layout");
  return { success: "Account details saved." };
}

const ADDRESS_FIELDS = [
  "firstName",
  "lastName",
  "company",
  "address1",
  "address2",
  "city",
  "state",
  "postcode",
  "country",
] as const;

// One action for both tabs — "billing" also carries email + phone, like WooCommerce
export async function updateAddressAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const authToken = await getAuthToken({ persist: true });
  if (!authToken) return SIGNED_OUT;

  const type = readField(form, "type") === "shipping" ? "shipping" : "billing";
  const address: Record<string, string> = {};
  for (const field of ADDRESS_FIELDS) address[field] = readField(form, field);

  const fieldErrors: Record<string, string> = {};
  if (!address.firstName) fieldErrors.firstName = "Enter a first name.";
  if (!address.lastName) fieldErrors.lastName = "Enter a last name.";
  if (!address.address1) fieldErrors.address1 = "Enter a street address.";
  if (!address.city) fieldErrors.city = "Enter a town or city.";
  if (!address.postcode) fieldErrors.postcode = "Enter a ZIP / postcode.";
  if (!address.country) fieldErrors.country = "Choose a country.";

  if (type === "billing") {
    const email = readField(form, "email");
    const phone = readField(form, "phone");
    if (!isEmail(email)) fieldErrors.email = "Enter a valid email address.";
    address.email = email;
    address.phone = phone;
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    await updateCustomer(authToken, { [type]: address });
  } catch (error) {
    return { error: toErrorMessage(error, "Could not save the address.") };
  }

  revalidatePath("/account/addresses", "layout");
  return { success: "Address saved." };
}
