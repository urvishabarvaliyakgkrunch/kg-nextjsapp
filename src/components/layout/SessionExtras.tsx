// src/components/layout/SessionExtras.tsx
// Everything in the root layout that depends on the signed-in cookie, isolated behind
// its own Suspense boundary so cookies() only taints this slice — not the whole page —
// letting shop/product/coas prerender as a cached static shell under Cache Components.

import CartOwnerSync from "@/components/cart/CartOwnerSync";
import AgeGate from "@/components/gate/AgeGate";
import AttentiveTag from "@/components/tracking/AttentiveTag";
import AttentiveCart from "@/components/tracking/AttentiveCart";
import CartRecoverySync from "@/components/tracking/CartRecoverySync";
import { getSession } from "@/lib/session";
import { readTokenUser } from "@/lib/jwt";

export default async function SessionExtras() {
  // Read the cookie, not WordPress — the gate only needs to know somebody signed in once
  const session = await getSession();
  const signedIn = Boolean(session);
  // The browser cart is wiped when a different account signs in on it
  const cartOwner = session ? readTokenUser(session.authToken) : "";

  return (
    <>
      <CartOwnerSync ownerKey={cartOwner} />
      {/* Attentive only runs for signed-in visitors, after they passed the 21+ gate */}
      {signedIn ? (
        <>
          <AttentiveCart />
          <AttentiveTag />
          {/* Saves the cart in WordPress so it can email people who leave without paying */}
          <CartRecoverySync />
        </>
      ) : null}
      {/* Guests see nothing until they confirm 21+ and research use */}
      {signedIn ? null : <AgeGate />}
    </>
  );
}
