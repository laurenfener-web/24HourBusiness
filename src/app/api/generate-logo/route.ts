import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { businessName, style, color } = await req.json();

  if (!businessName?.trim()) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  // Derive a darker shade for depth
  const prompt = `You are an expert SVG logo designer. Generate 4 distinct icon mark concepts for the business: "${businessName}"

Style: ${style || "Minimal"}
Primary color: ${color || "#4f46e5"}

STRICT REQUIREMENTS:
- Each SVG must have: viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
- Use ONLY these elements: circle, rect, ellipse, polygon, path, g
- Primary color: ${color || "#4f46e5"}
- You may also use white (#ffffff) and a darkened variant of the primary color
- 3–8 elements max — simple, clean, scalable
- NO text elements, NO foreignObject, NO images, NO clipPath
- Each of the 4 concepts must be visually distinct (different shapes / approaches)
- Think: lettermark, abstract mark, geometric icon, symbolic icon

Return ONLY valid JSON — no markdown fences, no explanation:
[
  {"concept": "short concept name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "short concept name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "short concept name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "short concept name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"}
]`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const logos: { concept: string; svg: string }[] = JSON.parse(cleaned);

    return NextResponse.json({ logos });
  } catch (err) {
    console.error("generate-logo error:", err);
    return NextResponse.json({ error: "Failed to generate logos" }, { status: 500 });
  }
}
