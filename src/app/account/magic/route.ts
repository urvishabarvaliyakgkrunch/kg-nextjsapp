// src/app/account/magic/route.ts

import { NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/magicLink";
import { saveSession } from "@/lib/session";

// The sign-in link in the email lands here. A page cannot set cookies, so the
// token is swapped for a session in this route handler, then we send them on.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("el_ml") ?? "";
  const account = new URL("/account", request.url);

  if (!token) {
    account.searchParams.set("ml_error", "1");
    return NextResponse.redirect(account);
  }

  try {
    const session = await verifyMagicLink(token);
    await saveSession(session);
  } catch {
    account.searchParams.set("ml_error", "1");
    return NextResponse.redirect(account);
  }

  return NextResponse.redirect(account);
}
