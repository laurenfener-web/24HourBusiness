import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const { message } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const from = session?.email ?? "anonymous";
  const body = `From: ${from}\n\n${message}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "feedback@24hourbusiness.com",
      to: "laurenfener@gmail.com",
      subject: `24HourBusiness Feedback from ${from}`,
      text: body,
    }),
  });

  return NextResponse.json({ ok: true });
}
