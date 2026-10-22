// src/components/account/MagicLinkForm.tsx
"use client";

import { useActionState } from "react";
import { magicLinkAction } from "@/actions/auth";
import AuthField from "@/components/account/AuthField";
import FormBanner from "@/components/account/FormBanner";
import SubmitButton from "@/components/account/SubmitButton";
import type { FormState } from "@/types/account";

const EMPTY: FormState = {};

interface Props {
  email: string;
  onEmailChange: (value: string) => void;
}

export default function MagicLinkForm({ email, onEmailChange }: Props) {
  const [state, action] = useActionState(magicLinkAction, EMPTY);

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

      <SubmitButton label="Email me a login link" pendingLabel="Sending…" full />

      <FormBanner error={state.error} success={state.success} />
    </form>
  );
}
