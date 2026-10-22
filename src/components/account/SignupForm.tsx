// src/components/account/SignupForm.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import AuthField from "@/components/account/AuthField";
import FormBanner from "@/components/account/FormBanner";
import SubmitButton from "@/components/account/SubmitButton";
import { TERMS_LINKS } from "@/lib/accountCopy";
import type { FormState } from "@/types/account";

const EMPTY: FormState = {};

export default function SignupForm() {
  const [state, action] = useActionState(registerAction, EMPTY);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormBanner error={state.error} />

      <AuthField
        name="email"
        label="Email"
        icon="at"
        type="email"
        autoComplete="email"
        error={errors.email}
      />
      <AuthField
        name="password"
        label="Password"
        icon="key"
        type="password"
        autoComplete="new-password"
        error={errors.password}
      />
      <AuthField
        name="confirmPassword"
        label="Confirm Password"
        icon="key"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          name="firstName"
          label="First Name"
          icon="user"
          autoComplete="given-name"
          error={errors.firstName}
        />
        <AuthField
          name="lastName"
          label="Last Name"
          icon="user"
          autoComplete="family-name"
          error={errors.lastName}
        />
      </div>

      <div className="flex flex-col gap-2 py-1">
        <label className="flex items-start gap-2 font-sans text-[13px] text-ink">
          <input type="checkbox" name="terms" className="mt-0.5 size-4 accent-blue" />
          <span>
            I accept the{" "}
            <Link href={TERMS_LINKS.terms} className="text-blue hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href={TERMS_LINKS.privacy} className="text-blue hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms ? (
          <p role="alert" className="font-sans text-[12px] text-danger">
            {errors.terms}
          </p>
        ) : null}
      </div>

      <SubmitButton label="Sign Up" pendingLabel="Creating account…" full />
    </form>
  );
}
