// app/api/templates/list/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimited } from "@/utils/resendThrottle";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const { data } = await rateLimited(() => resend.templates.list());
    return NextResponse.json(data); // only send array
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}
