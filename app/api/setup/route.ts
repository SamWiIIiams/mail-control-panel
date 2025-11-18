// app/api/setup/route.ts
export const runtime = "nodejs"; // MUST be first

import { NextRequest, NextResponse } from "next/server";
import { writeConfig, StoredConfig } from "@/lib/config";
import { encryptString } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // encrypt the Resend API key
    const encryptedApiKey = body.resendApiKey
      ? await encryptString(body.resendApiKey)
      : undefined;

    const cfg: StoredConfig = {
      setupComplete: true,
      admin: {
        username: body.username,
        passwordHash: body.password, // ideally hash
      },
      resend: {
        apiKeyEncrypted: encryptedApiKey,
        fromEmail: body.fromEmail || undefined,
      },
    };

    await writeConfig(cfg);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Setup error", err);
    return NextResponse.json({ ok: false, error: "Failed to save config" }, { status: 500 });
  }
}
