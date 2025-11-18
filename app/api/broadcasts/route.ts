import { NextResponse } from "next/server";
import { Resend } from "resend";
import { replaceTemplateVariables } from "@/utils/replaceTemplateVariables";
import { getResendApiKey } from "@/lib/config";

export async function POST(req: Request) {
  try {

    const apiKey = await getResendApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Resend API key not configured" },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await req.json();
    const { html, variables, segmentId, subject, from } = body;

    // Basic validation
    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 });
    }
    if (!segmentId) {
      return NextResponse.json({ error: "segmentId is required" }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: "subject is required" }, { status: 400 });
    }
    if (!from) {
      return NextResponse.json({ error: "'from' field is required" }, { status: 400 });
    }

    // Inject variables into template
    const processedHtml = replaceTemplateVariables(html, variables ?? {});

    // Resend broadcast creation
    try {
      const { data, error } = await resend.broadcasts.create({
        from,
        subject,
        segmentId,
        html: processedHtml,
      });

      if (error) {
        console.error("Resend broadcast error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } catch (apiErr) {
      console.error("Broadcast API threw:", apiErr);
      const message = apiErr instanceof Error ? apiErr.message : "Unknown broadcast API error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    console.error("Unexpected error in /api/broadcast:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
