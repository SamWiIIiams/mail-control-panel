import { NextResponse } from "next/server";
import { Resend } from "resend";
import { replaceTemplateVariables } from "@/utils/replaceTemplateVariables";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { html, variables, segmentId, subject, from } = await req.json();

    // Process template HTML with injected variable values
    const processedHtml = replaceTemplateVariables(html, variables);

    // Create broadcast via Resend API
    let data, error;

    try {
      const result = await resend.broadcasts.create({
        from,
        subject,
        segmentId,
        html: processedHtml,
      });
      data = result.data;
      error = result.error;
      console.log("Broadcast response from Resend:", result);
    } catch (apiErr) {
      console.error("Broadcast API threw:", apiErr);
      return NextResponse.json(
        { error: (apiErr as Error).message },
        { status: 500 }
      );
    }

    if (error) {
      console.error("Resend broadcast error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error in /api/broadcast:", err);
    return NextResponse.json(
      { error: "Failed to send broadcast" },
      { status: 500 }
    );
  }
}
