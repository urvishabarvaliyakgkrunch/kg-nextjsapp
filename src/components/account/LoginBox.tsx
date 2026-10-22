// src/components/account/LoginBox.tsx
"use client";

import { useState } from "react";
import MagicLinkForm from "@/components/account/MagicLinkForm";
import PasswordLoginForm from "@/components/account/PasswordLoginForm";
import { clearRememberedLogin, writeRememberedLogin } from "@/lib/rememberLogin";

type Mode = "magic" | "password";

// Live site opens on the magic-link box; the password box is one click away
export default function LoginBox({ initialEmail }: { initialEmail: string }) {
  const [mode, setMode] = useState<Mode>("magic");
  // Keep whatever was typed when switching, exactly like the WordPress script
  const [email, setEmail] = useState(initialEmail);
  // A saved name means the box was ticked last time
  const [remember, setRemember] = useState(Boolean(initialEmail));

  // Storage is written from the handlers, never from an effect — an effect would also
  // run on the empty first render and wipe the saved name before it is restored
  function save(username: string, keep: boolean) {
    const clean = username.trim();
    if (keep && clean) {
      writeRememberedLogin(clean);
    } else {
      clearRememberedLogin();
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (remember) save(value, true);
  }

  function handleRememberChange(keep: boolean) {
    setRemember(keep);
    save(email, keep);
  }

  return (
    <div className="flex flex-col gap-4">
      {mode === "magic" ? (
        <MagicLinkForm email={email} onEmailChange={handleEmailChange} />
      ) : (
        <PasswordLoginForm
          email={email}
          onEmailChange={handleEmailChange}
          remember={remember}
          onRememberChange={handleRememberChange}
        />
      )}

      <button
        type="button"
        onClick={() => setMode(mode === "magic" ? "password" : "magic")}
        className="w-full text-center font-sans text-[14px] text-blue hover:underline"
      >
        {mode === "magic" ? "Login with password" : "Email me a login link instead"}
      </button>
    </div>
  );
}
