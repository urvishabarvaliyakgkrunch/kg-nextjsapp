// src/types/gate.ts

// What the age gate server action hands back to the form.
export interface GateState {
  // Red message shown under the checkboxes
  error?: string;
  // True when the email already has an account, so the form can offer a sign-in link
  emailTaken?: boolean;
  // True once the account exists and the session cookie is written
  passed?: boolean;
}
