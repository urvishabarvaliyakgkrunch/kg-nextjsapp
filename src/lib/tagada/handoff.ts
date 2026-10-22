// src/lib/tagada/handoff.ts
// Remembers that this tab has already been sent to the Tagada checkout.
//
// Without it the back button lands on /checkout, which immediately starts
// another checkout and throws the shopper out again — they can never get
// back to the store. Lives in sessionStorage so it dies with the tab and
// never leaks between shoppers on a shared machine.

const KEY = "elx_checkout_handoff";

export function hasHandoff(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    // Private mode or blocked storage — treat it as a first visit
    return false;
  }
}

export function markHandoff(): void {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // Not being able to remember only costs us the back-button guard
  }
}

export function clearHandoff(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clean up if storage was never reachable
  }
}
