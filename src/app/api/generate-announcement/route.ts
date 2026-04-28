import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { businessName, senderEmail } = await req.json();

  if (!businessName?.trim()) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  const prompt = `Write a short, genuine launch announcement email from a new business owner to their personal network (friends, family, former colleagues).

Business name: ${businessName}
Sender: ${senderEmail || "the owner"}

Requirements:
- Warm and personal tone, not corporate or salesy
- 3–4 short paragraphs max
- Briefly explain what the business does (you can make a reasonable assumption based on the name)
- End with a simple ask: share with someone who might need this, or reply with questions
- Use no more than one exclamation point total
- Subject line: catchy but authentic — not "Exciting news!" or "Big announcement"

Return ONLY valid JSON with exactly two fields:
{"subject": "...", "body": "..."}

The body must be plain text with \\n\\n between paragraphs. No HTML, no markdown.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const { subject, body } = JSON.parse(cleaned);

    return NextResponse.json({ subject, body });
  } catch (err) {
    console.error("generate-announcement error:", err);
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
  }
}
