// src/actions/ageGate.ts
"use server";

import { randomBytes } from "node:crypto";
import * as auth from "@/lib/auth";
import { RESEARCH_FIELDS, RESEARCH_META_KEY } from "@/lib/ageGateCopy";
import { claimPendingReferral } from "@/lib/referralClaim";
import { saveSession } from "@/lib/session";
import { isEmail, readField, toErrorMessage } from "@/lib/validate";
import type { GateState } from "@/types/gate";

// Woo insists on a password but the visitor never picks one at the gate — they come back
// later through the magic link or a password reset, same as the WordPress gate worked
function hiddenPassword(): string {
  return randomBytes(24).toString("base64url");
}

// Woo rewords this between versions, so match the idea rather than one exact sentence
const EMAIL_TAKEN = /already registered|already exists|existing user/i;

export async function confirmAgeGateAction(
  _prev: GateState,
  form: FormData
): Promise<GateState> {
  const email = readField(form, "email");
  const research = readField(form, "research");

  // Checked in the same order as the WordPress handler so the wording stays identical
  if (form.get("age") !== "on" || form.get("ruo") !== "on") {
    return { error: "Please confirm both acknowledgements." };
  }
  if (!isEmail(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!RESEARCH_FIELDS.some((field) => field.value === research)) {
    return { error: "Please select a field of research." };
  }

  try {
    // authenticate: true inside the mutation means this also signs the visitor in
    const session = await auth.register({
      email,
      password: hiddenPassword(),
      metaData: [{ key: RESEARCH_META_KEY, value: research }],
    });
    await saveSession(session);
    await claimPendingReferral(session.authToken).catch(() => null);
  } catch (error) {
    const message = toErrorMessage(
      error,
      "Unable to create your account. Please try again."
    );
    if (EMAIL_TAKEN.test(message)) {
      return {
        emailTaken: true,
        error: "An account is already registered with this email.",
      };
    }
    return { error: message };
  }

  return { passed: true };
}
