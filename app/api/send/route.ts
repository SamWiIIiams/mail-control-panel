import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendApiKey } from "@/lib/sqlite"; // fetches stored API key

interface SendEmailRequest {
  templateId: string;
  segmentId: string;
  variables: Record<string, string>;
}

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

    const body: SendEmailRequest = await req.json();

    // Basic validation
    if (!body.templateId || !body.segmentId) {
      return NextResponse.json(
        { error: "templateId and segmentId are required" },
        { status: 400 }
      );
    }

    // Example placeholder: send email via Resend API
    // const response = await resend.emails.send({
    //   from: "Sam <sam@jinjnet.com>", // or pull from template
    //   template: body.templateId,
    //   variables: body.variables,
    //   // to: you can resolve segment members here if needed
    // });

    // return NextResponse.json({ success: true, response });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to send email" },
      { status: 500 }
    );
  }
}
