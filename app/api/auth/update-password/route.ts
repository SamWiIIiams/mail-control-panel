import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readSettings, writeSettings } from "@/lib/sqlite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encryptString } from "@/lib/crypto";

export async function POST(req: Request) {
  // Ensure authenticated
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const settings = readSettings();
  if (!settings?.password_hash) {
    return NextResponse.json(
      { error: "Password not configured" },
      { status: 500 }
    );
  }

  const valid = await bcrypt.compare(currentPassword, settings.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  await writeSettings({
    password_hash: newHash,
  });

  return NextResponse.json({ ok: true });
}
