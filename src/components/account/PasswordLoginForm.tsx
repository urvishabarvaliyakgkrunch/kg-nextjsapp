// src/components/account/PasswordLoginForm.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import AuthField from "@/components/account/AuthField";
import FormBanner from "@/components/account/FormBanner";
import SubmitButton from "@/components/account/SubmitButton";
import type { FormState } from "@/types/account";

const EMPTY: FormState = {};

interface Props {
  email: string;
  onEmailChange: (value: string) => void;
  remember: boolean;
  onRememberChange: (value: boolean) => void;
}

export default function PasswordLoginForm({
  email,
  onEmailChange,
  remember,
  onRememberChange,
}: Props) {
  const [state, action] = useActionState(loginAction, EMPTY);

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthField
        name="username"
        label="Username / Email"
        icon="userPlus"
        autoComplete="username"
        value={email}
        onValueChange={onEmailChange}
        error={state.fieldErrors?.username}
      />

      <AuthField
        name="password"
        label="Password"
        icon="key"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 font-sans text-[13px] text-ink">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className="size-4 accent-blue"
          />
          Remember me
        </label>

        <Link
          href="/account/lost-password"
          className="font-sans text-[13px] text-blue hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <SubmitButton label="Sign in" pendingLabel="Signing in…" full />

      <FormBanner error={state.error} />
    </form>
  );
}
