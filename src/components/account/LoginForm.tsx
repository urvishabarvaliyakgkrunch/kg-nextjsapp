// src/components/account/LoginForm.tsx
"use client";

import LoginBox from "@/components/account/LoginBox";
import { useHasMounted } from "@/hooks/useHasMounted";
import { readRememberedLogin } from "@/lib/rememberLogin";

// localStorage cannot be read on the server, so the first render must be the empty box.
// The key swap remounts it once the saved name is readable.
export default function LoginForm() {
  const hasMounted = useHasMounted();

  return (
    <LoginBox
      key={hasMounted ? "restored" : "blank"}
      initialEmail={hasMounted ? readRememberedLogin() : ""}
    />
  );
}
