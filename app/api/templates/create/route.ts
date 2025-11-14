// pages/api/templates.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { name, html, variables, subject, from, replyTo, text } = await req.json();

  try {
    const { data, error } = await resend.templates.create({
      name,
      html,
      variables,
      subject,
      from,
      replyTo,
      text,
    });

    return new Response(JSON.stringify({ data, error }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}
