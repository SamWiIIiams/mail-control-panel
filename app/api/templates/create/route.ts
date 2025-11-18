import { NextResponse } from "next/server";
import { Resend } from "resend";
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
    const { name, html, variables, subject, from, replyTo, text } = body;

    // Basic validation
    if (!name) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }
    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 });
    }

    const { data, error } = await resend.templates.create({
      name,
      html,
      variables: variables ?? {},
      subject,
      from,
      replyTo,
      text,
    });

    if (error) {
      console.error("Resend template creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected template creation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
