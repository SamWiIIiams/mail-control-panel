import { NextResponse } from "next/server";
import { writeSettings } from "@/lib/sqlite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encryptString } from "@/lib/crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiKey } = await req.json();
  if (!apiKey)
    return NextResponse.json({ error: "Missing key" }, { status: 400 });

  // Hash before saving
  const encryptedApiKey = apiKey
      ? await encryptString(apiKey)
      : undefined;

  await writeSettings({
    resend_api_key: encryptedApiKey,
  });

  return NextResponse.json({ ok: true });
}
