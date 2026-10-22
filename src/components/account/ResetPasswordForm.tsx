// src/components/account/ResetPasswordForm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { resetPasswordAction } from "@/actions/auth";
import FormBanner from "@/components/account/FormBanner";
import AuthField from "@/components/account/AuthField";
import SubmitButton from "@/components/account/SubmitButton";
import type { FormState } from "@/types/account";

const EMPTY: FormState = {};

interface Props {
  // Both values ride in the link WordPress emails — we only pass them straight back
  resetKey: string;
  login: string;
}

export default function ResetPasswordForm({ resetKey, login }: Props) {
  const [state, action] = useActionState(resetPasswordAction, EMPTY);
  const router = useRouter();

  // Once the password is saved, wait a moment so the visitor can read the message,
  // then send them to the sign-in page. "replace" removes the reset link from the
  // browser history, so the Back button cannot return to it.
  useEffect(() => {
    if (!state.success) return;
    const timer = setTimeout(() => router.replace("/account"), 2500);
    return () => clearTimeout(timer); // stop the timer if the page is closed first
  }, [state.success, router]);

  // Success: show only the message and hide the form, so it cannot be submitted again
  if (state.success) {
    return (
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-5">
        <FormBanner success={state.success} />
        <p className="text-center font-sans text-[14px] text-lot-body">
          Taking you to sign in…
        </p>
        <Link href="/account" replace className="text-center font-sans text-[13px] text-blue hover:underline">
          Go to sign in now
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="mx-auto flex w-full max-w-[520px] flex-col gap-5">
      <input type="hidden" name="key" value={resetKey} />
      <input type="hidden" name="login" value={login} />

      <FormBanner error={state.error} success={state.success} />

      <AuthField
        name="password"
        label="New password"
        icon="key"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
      />

      <AuthField
        name="confirmPassword"
        label="Confirm new password"
        icon="key"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword}
      />

      <SubmitButton label="Set new password" pendingLabel="Saving…" full />

      <Link href="/account" className="text-center font-sans text-[13px] text-blue hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
