// app/api/templates/list/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { resendLimiter } from "@/utils/resendThrottle";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const { data } = await resendLimiter.schedule(() =>
      resend.templates.list()
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
