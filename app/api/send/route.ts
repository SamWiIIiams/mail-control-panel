import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendEmailRequest {
  templateId: string;
  segmentId: string;
  variables: Record<string, string>;
}

export async function POST(req: Request) {
  try {
    const body: SendEmailRequest = await req.json();

    // Here we send the email
    // const response = await resend.emails.send({
    //   from: "Sam <sam@jinjnet.com>", // or pull from template
    //   //template: body.templateId,
    //   // Optionally, you can resolve recipients based on the segment.
    //   // If you want to send to a segment, you may need to fetch segment members
    //   // or pass segment info to the backend.
    //   //to: [{ email: "test@example.com" }], // placeholder, replace with real audience
    //   //variables: body.variables,
    // });

    // return NextResponse.json({ success: true, response });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}