// src/app/account/lost-password/page.tsx

import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";
import ResetPasswordForm from "@/components/account/ResetPasswordForm";
import PageHero from "@/components/common/PageHero";
import { isResetLinkValid } from "@/lib/magicLink";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = { title: "Reset password" };

// WordPress emails a link ending in ?key=…&login=… — that form sets the new password.
// Without those values we show the "email me a link" form instead.
export default async function LostPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; login?: string }>;
}) {
  const { key, login } = await searchParams;
  const hasResetLink = Boolean(key && login);

  // A link that was already used (or timed out) must not show the password form again
  const linkExpired = hasResetLink && !(await isResetLinkValid(key!, login!));
  const showResetForm = hasResetLink && !linkExpired;

  return (
    <>
      <PageHero
        eyebrow="Secure account"
        title={
          linkExpired
            ? "Link Expired."
            : showResetForm
              ? "Set A New Password."
              : "Reset Password."
        }
        description={
          linkExpired
            ? "This reset link was already used or has expired. Request a new one below."
            : showResetForm
              ? "Choose a new password for your research account."
              : "We will email you a secure link to set a new password."
        }
      />
      <section className="container-site py-10 md:py-[60px]">
        {showResetForm ? (
          <ResetPasswordForm resetKey={key!} login={login!} />
        ) : (
          // Expired link → the normal "email me a link" form, so they can ask for a new one
          <ForgotPasswordForm />
        )}
      </section>
    </>
  );
}
