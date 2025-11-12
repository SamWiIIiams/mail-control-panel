import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerSession } from "next-auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { to, subject, html } = await req.json();

  try {
    const data = await resend.emails.send({
      from: "Jinjnet <noreply@jinjnet.com>",
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
