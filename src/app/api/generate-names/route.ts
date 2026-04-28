import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { description, vibe } = await req.json();

  if (!description?.trim()) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }

  const prompt = `You are a branding expert. Generate 6 creative, memorable business names for the following business idea.

Business description: ${description}
${vibe ? `Desired vibe/style: ${vibe}` : ""}

Return ONLY a valid JSON array with exactly 6 objects. Each object must have:
- "name": the business name (2-4 words max, punchy and memorable)
- "tagline": a one-line tagline (under 10 words)
- "why": one sentence explaining why this name works

Example format:
[{"name":"Example Co","tagline":"Doing things differently.","why":"Short and instantly memorable."}]

Return only the JSON array, no other text.`;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Strip markdown code fences if Claude wraps the JSON
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const names = JSON.parse(cleaned);

    return NextResponse.json({ names });
  } catch (err) {
    console.error("generate-names error:", err);
    return NextResponse.json({ error: "Failed to generate names" }, { status: 500 });
  }
}
