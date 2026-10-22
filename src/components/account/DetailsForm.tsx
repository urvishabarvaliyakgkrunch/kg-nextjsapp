// src/components/account/DetailsForm.tsx
"use client";

import { useActionState } from "react";
import { updateDetailsAction } from "@/actions/account";
import FormBanner from "@/components/account/FormBanner";
import FormField from "@/components/account/FormField";
import PasswordInput from "@/components/account/PasswordInput";
import SubmitButton from "@/components/account/SubmitButton";
import type { FormState, GQLCustomer } from "@/types/account";
import Link from "next/link";

const EMPTY: FormState = {};

export default function DetailsForm({ customer }: { customer: GQLCustomer }) {
  const [state, action] = useActionState(updateDetailsAction, EMPTY);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6">
            <Link href="/account/addresses" className="text-blue font-bold">Back to addresses</Link>

    <form
      action={action}
      className="mx-auto flex w-full flex-col gap-6 border border-line p-4 md:p-8"
    >
      <FormBanner error={state.error} success={state.success} />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          name="firstName"
          label="First name"
          defaultValue={customer.firstName ?? ""}
          autoComplete="given-name"
          required
          error={errors.firstName}
        />
        <FormField
          name="lastName"
          label="Last name"
          defaultValue={customer.lastName ?? ""}
          autoComplete="family-name"
          required
          error={errors.lastName}
        />
      </div>

      <FormField
        name="displayName"
        label="Display name"
        defaultValue={customer.displayName ?? ""}
        required
        error={errors.displayName}
        hint="This will be how your name will be displayed in the account section and in reviews"
      />

      <FormField
        name="email"
        label="Email address"
        type="email"
        defaultValue={customer.email ?? ""}
        autoComplete="email"
        required
        error={errors.email}
      />

      <p className="mt-2 font-mono text-[14px] font-bold text-ink-dark">Password change</p>

      {/* Leave all three empty to keep the current password */}
      <PasswordInput
        name="currentPassword"
        label="Current password (leave blank to leave unchanged)"
        autoComplete="current-password"
        error={errors.currentPassword}
      />
      <PasswordInput
        name="password"
        label="New password (leave blank to leave unchanged)"
        autoComplete="new-password"
        error={errors.password}
      />
      <PasswordInput
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <div>
        <SubmitButton label="Save changes" pendingLabel="Saving…" />
      </div>
    </form>
    </div>
  );
}
