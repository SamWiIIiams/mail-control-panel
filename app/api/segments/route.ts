import { NextResponse } from "next/server";
import { Resend } from "resend";
import { resendLimiter } from "@/utils/resendThrottle";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const { data, error } = await resendLimiter.schedule(() =>
      resend.segments.list()
    );

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return only the data array (segments)
    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error fetching segments:", err);
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}
