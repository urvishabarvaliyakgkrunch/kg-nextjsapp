// src/lib/validate.ts
// Small form checks. Woo validates again on the server — this only saves a round trip.

import { decodeEntities } from "@/lib/storeCart";

export function readField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Woo's own minimum is 1 character; 8 is the shop's rule so weak passwords never get in
export const MIN_PASSWORD_LENGTH = 8;

export function passwordProblem(value: string): string | null {
  if (!value) return "Enter a password.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

// WordPress error messages arrive as HTML with tags and entities — strip them for the UI
export function cleanWpError(message: string): string {
  // Decode first: WordPress sends "&lt;strong&gt;Error:&lt;/strong&gt;", so the tags
  // are still entities at this point and tag-stripping alone would leave them on screen
  return decodeEntities(message)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// WordPress answers this when PHP blew up — it tells a shopper nothing, so swap it out
const SERVER_ERRORS = [/^internal server error$/i, /^graphql network error/i];

// Any thrown value -> one readable sentence for the red banner
export function toErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) return fallback;

  const clean = cleanWpError(error.message);
  if (SERVER_ERRORS.some((pattern) => pattern.test(clean))) return fallback;
  return clean;
}
