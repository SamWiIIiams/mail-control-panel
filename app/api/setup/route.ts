// app/api/setup/route.ts
export const runtime = "nodejs"; // MUST stay first

import { NextRequest, NextResponse } from "next/server";
import { writeSettings } from "@/lib/sqlite";
import { encryptString } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const encryptedApiKey = body.resendApiKey
      ? await encryptString(body.resendApiKey)
      : undefined;

    await writeSettings({
      username: body.username,
      password_hash: body.password,
      resend_api_key: encryptedApiKey,
      setup_complete: 1,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Setup error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save setup settings" },
      { status: 500 }
    );
  }
}
