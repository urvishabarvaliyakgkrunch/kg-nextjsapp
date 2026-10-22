// src/components/account/LogoutLink.tsx

import { logoutAction } from "@/actions/auth";

// Reads as a link inside a sentence, but posts like a button — signing out changes state
export default function LogoutLink({ label = "Log out" }: { label?: string }) {
  return (
    <form action={logoutAction} className="inline">
      <button type="submit" className="text-blue underline-offset-2 hover:underline">
        {label}
      </button>
    </form>
  );
}
