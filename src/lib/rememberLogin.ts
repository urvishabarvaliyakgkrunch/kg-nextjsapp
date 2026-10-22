// src/lib/rememberLogin.ts
// Remembers who last signed in, so the login box comes back filled.
// Browser-only convenience — it never reaches the server and holds no password.

const KEY = "elx_remember_login";

// Private windows and blocked site data make these calls throw, so never let one break the page
export function readRememberedLogin(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeRememberedLogin(username: string): void {
  try {
    window.localStorage.setItem(KEY, username);
  } catch {
    // Nothing to do — the box simply starts empty next time
  }
}

export function clearRememberedLogin(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Same as above
  }
}
