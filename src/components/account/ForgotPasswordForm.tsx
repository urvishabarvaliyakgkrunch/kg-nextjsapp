// src/components/account/ForgotPasswordForm.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import FormBanner from "@/components/account/FormBanner";
import AuthField from "@/components/account/AuthField";
import SubmitButton from "@/components/account/SubmitButton";
import type { FormState } from "@/types/account";

const EMPTY: FormState = {};

export default function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, EMPTY);

  return (
    <form action={action} className="mx-auto flex w-full max-w-[520px] flex-col gap-5">
      <FormBanner error={state.error} success={state.success} />

      <p className="font-sans text-[14px] text-lot-body">
        Enter your username or email and we will email you a reset link.
      </p>

      <AuthField
        name="username"
        label="Username / Email"
        icon="userPlus"
        autoComplete="username"
        error={state.fieldErrors?.username}
      />

      <SubmitButton label="Send reset link" pendingLabel="Sending…" full />

      <Link href="/account" className="text-center font-sans text-[13px] text-blue hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
