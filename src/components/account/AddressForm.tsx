// src/components/account/AddressForm.tsx
"use client";

import { useActionState } from "react";
import { updateAddressAction } from "@/actions/account";
import FormBanner from "@/components/account/FormBanner";
import FormField from "@/components/account/FormField";
import FormSelect from "@/components/account/FormSelect";
import SubmitButton from "@/components/account/SubmitButton";
import type { LocationOptions } from "@/lib/queries/account";
import type { FormState, GQLAddress } from "@/types/account";
import Link from "next/link";

const EMPTY: FormState = {};

interface Props {
  type: "billing" | "shipping";
  address: GQLAddress | null;
  locations: LocationOptions;
}

export default function AddressForm({ type, address, locations }: Props) {
  const [state, action] = useActionState(updateAddressAction, EMPTY);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6">
      <Link href="/account/addresses" className="text-blue font-bold">Back to addresses</Link>
      <form action={action} className="mx-auto flex w-full flex-col gap-6 border border-line p-4 md:p-8">
        {/* Tells the one shared action which address block it is saving */}
        <input type="hidden" name="type" value={type} />

        <FormBanner error={state.error} success={state.success} />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            name="firstName"
            label="First name"
            defaultValue={address?.firstName ?? ""}
            autoComplete="given-name"
            required
            error={errors.firstName}
          />
          <FormField
            name="lastName"
            label="Last name"
            defaultValue={address?.lastName ?? ""}
            autoComplete="family-name"
            required
            error={errors.lastName}
          />
        </div>

        <FormField
          name="company"
          label="Company / Lab (optional)"
          defaultValue={address?.company ?? ""}
          autoComplete="organization"
        />

        <FormField
          name="address1"
          label="Street address"
          defaultValue={address?.address1 ?? ""}
          autoComplete="address-line1"
          required
          error={errors.address1}
        />

        <FormField
          name="address2"
          label="Apartment, suite, unit (optional)"
          defaultValue={address?.address2 ?? ""}
          autoComplete="address-line2"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            name="city"
            label="Town / City"
            defaultValue={address?.city ?? ""}
            autoComplete="address-level2"
            required
            error={errors.city}
          />
          <FormSelect
            name="state"
            label="State"
            defaultValue={address?.state ?? ""}
            placeholder="Choose a state"
            options={locations.states.map((s) => ({ value: s.code, label: s.name }))}
            error={errors.state}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            name="postcode"
            label="ZIP code"
            defaultValue={address?.postcode ?? ""}
            autoComplete="postal-code"
            required
            error={errors.postcode}
          />
          <FormSelect
            name="country"
            label="Country"
            defaultValue={address?.country ?? locations.countries[0]}
            options={locations.countries.map((c) => ({ value: c, label: c }))}
            required
            error={errors.country}
          />
        </div>

        {/* Woo keeps email and phone on the billing address only */}
        {type === "billing" ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              name="email"
              label="Email"
              type="email"
              defaultValue={address?.email ?? ""}
              autoComplete="email"
              required
              error={errors.email}
            />
            <FormField
              name="phone"
              label="Phone"
              type="tel"
              defaultValue={address?.phone ?? ""}
              autoComplete="tel"
            />
          </div>
        ) : null}

        <div>
          <SubmitButton label="Save address" pendingLabel="Saving…" />
        </div>
      </form>
    </div>
  );
}
