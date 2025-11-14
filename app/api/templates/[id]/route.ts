import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimited } from "@/utils/resendThrottle";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const template = await rateLimited(() => resend.templates.get(id));
    return NextResponse.json(template); // full template including variables
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}