import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimited } from "@/utils/resendThrottle";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log("THE ID IS " + id);
    const template = await rateLimited(() => resend.templates.get(id));
    console.log("here is the template: " + JSON.stringify(template));
    return NextResponse.json(template); // full template including variables
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}