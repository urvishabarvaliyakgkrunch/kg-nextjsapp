// src/app/api/loyalty/settings/route.ts
// Saves loyalty notification preference or birthday from the client.

import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import { saveLoyaltySettings } from "@/lib/loyalty";

export async function POST(req: NextRequest) {
  const authToken = await getAuthToken();
  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json() as {
    emailOptIn?: boolean;
    birthday?: string;
    campaignId?: number;
  };

  // A birthday needs a real past date and the campaign that pays for it
  if (body.birthday !== undefined) {
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(body.birthday) && !Number.isNaN(Date.parse(body.birthday));
    if (!valid || !body.campaignId) {
      return NextResponse.json({ error: "Invalid birthday" }, { status: 400 });
    }
  }

  const result = await saveLoyaltySettings(authToken, {
    emailOptIn: body.emailOptIn,
    birthday: body.birthday,
    campaignId: body.campaignId,
  });

  if (!result) {
    return NextResponse.json({ error: "Save failed" }, { status: 400 });
  }

  return NextResponse.json({ saved: result.saved });
}
