// src/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import * as auth from "@/lib/auth";
import { BackendTimeoutError } from "@/lib/graphql";
import { requestMagicLink } from "@/lib/magicLink";
import { claimPendingReferral } from "@/lib/referralClaim";
import { clearSession, saveSession } from "@/lib/session";
import {
  isEmail,
  passwordProblem,
  readField,
  toErrorMessage,
} from "@/lib/validate";
import type { FormState } from "@/types/account";

export async function loginAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const username = readField(form, "username");
  const password = readField(form, "password");
  // Unticked means the cookie should disappear when the browser closes
  const remember = form.get("remember") === "on";

  const fieldErrors: Record<string, string> = {};
  if (!username) fieldErrors.username = "Enter your username or email.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    const session = await auth.login(username, password, remember);
    await saveSession(session);
  } catch (error) {
    return { error: toErrorMessage(error, "Could not sign you in. Please try again in a moment.") };
  }

  // redirect() throws, so it must sit outside the try block
  redirect("/account");
}

export async function registerAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const email = readField(form, "email");
  const password = readField(form, "password");
  const confirm = readField(form, "confirmPassword");
  const firstName = readField(form, "firstName");
  const lastName = readField(form, "lastName");
  const accepted = form.get("terms") === "on";

  const fieldErrors: Record<string, string> = {};
  if (!isEmail(email)) fieldErrors.email = "Enter a valid email address.";
  const passwordError = passwordProblem(password);
  if (passwordError) fieldErrors.password = passwordError;
  if (password !== confirm) fieldErrors.confirmPassword = "Passwords do not match.";
  if (!firstName) fieldErrors.firstName = "Enter your first name.";
  if (!lastName) fieldErrors.lastName = "Enter your last name.";
  if (!accepted) fieldErrors.terms = "Please accept the terms to continue.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    // WooCommerce sends the welcome email from this call — Next.js never emails anyone
    const session = await auth.register({ email, password, firstName, lastName });
    await saveSession(session);
    await claimPendingReferral(session.authToken).catch(() => null);
  } catch (error) {
    // The account is usually created before the slow part (sending the mail), so never
    // tell someone it failed — they would sign up twice and hit "email already in use"
    if (error instanceof BackendTimeoutError) {
      return {
        error:
          "That took too long. Your account may already be created — try signing in, or use the email link.",
      };
    }
    return { error: toErrorMessage(error, "Could not create the account.") };
  }

  redirect("/account");
}

// Asks WordPress to email a one-time sign-in link — no password involved
export async function magicLinkAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const email = readField(form, "username");
  if (!email) return { fieldErrors: { username: "Please enter your email." } };

  try {
    const result = await requestMagicLink(email);
    return result.ok ? { success: result.message } : { error: result.message };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function forgotPasswordAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const username = readField(form, "username");
  if (!username) {
    return { fieldErrors: { username: "Enter your username or email." } };
  }

  try {
    await auth.sendPasswordResetEmail(username);
  } catch (error) {
    return { error: toErrorMessage(error, "Could not send the reset email.") };
  }

  // Never say whether the account exists — that would let anyone test emails
  return {
    success:
      "If that account exists, we have emailed a password reset link. Check your inbox.",
  };
}

export async function resetPasswordAction(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const key = readField(form, "key");
  const login = readField(form, "login");
  const password = readField(form, "password");
  const confirm = readField(form, "confirmPassword");

  const fieldErrors: Record<string, string> = {};
  const passwordError = passwordProblem(password);
  if (passwordError) fieldErrors.password = passwordError;
  if (password !== confirm) fieldErrors.confirmPassword = "Passwords do not match.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    await auth.resetPassword(key, login, password);
  } catch (error) {
    return {
      error: toErrorMessage(error, "This reset link is invalid or has expired."),
    };
  }

  return { success: "Password changed. You can sign in now." };
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/account");
}
