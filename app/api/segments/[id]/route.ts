import { NextResponse } from "next/server";
import { Resend } from "resend";
import { resendLimiter } from "@/utils/resendThrottle";
import { getResendApiKey } from "@/lib/config"; // async function to fetch stored API key

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const { data, error } = await resendLimiter.schedule(() =>
      resend.contacts.list({
        segmentId: params.id,
      })
    );

    if (error) {
      console.error("Error fetching contacts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error fetching contacts:", err);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
