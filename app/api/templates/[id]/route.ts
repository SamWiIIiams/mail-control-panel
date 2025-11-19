import { NextResponse } from "next/server";
import { Resend } from "resend";
import { resendLimiter } from "@/utils/resendThrottle";
import { getResendApiKey } from "@/lib/sqlite";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = await getResendApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Resend API key not configured" },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const { id } = await params;

    const template = await resendLimiter.schedule(() =>
      resend.templates.get(id)
    );

    return NextResponse.json(template); // full template including variables
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}
