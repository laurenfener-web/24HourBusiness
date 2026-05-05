import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { businessName, industry, mood, color, description } = await req.json();

  if (!businessName?.trim()) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  const prompt = `You are a world-class brand identity designer. Create 6 professional logo icon marks for: "${businessName}"

Industry: ${industry || "General business"}
Design mood: ${mood || "Modern & Clean"}
Brand color: ${color || "#D4AF37"}${description?.trim() ? `\nFounder's vision: "${description.trim()}"` : ""}

DESIGN PHILOSOPHY:
- Each icon must work at 16px and at 500px — clarity at all sizes
- Conceptually connect each design to what "${businessName}" likely does
- Production-ready quality — these must look like real brand marks, not clip art

COVER THESE 6 ARCHETYPES (one each):
1. Letter/monogram mark — use the initial(s) of the business name, make them beautiful
2. Geometric abstraction — pure mathematical shapes arranged with intention
3. Symbolic icon — a real recognizable object or metaphor for the business
4. Badge or emblem — enclosed shape (circle, hexagon, shield) implying authority
5. Abstract flowing mark — curves, organic forms, motion or energy
6. Bold minimal — 1–3 shapes max, maximum visual impact through simplicity

TECHNICAL RULES:
- viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
- You MAY use <defs> containing <linearGradient> or <radialGradient> with <stop> elements
- Allowed elements: defs, linearGradient, radialGradient, stop, circle, rect, ellipse, polygon, path, g
- Primary color: ${color || "#D4AF37"}
- You may also use white (#ffffff), near-black (#1a1a1a), and lighter/darker shades of the primary
- For gradients: define in <defs> with unique id attributes, reference with fill="url(#id)"
- 3–16 elements — enough for sophistication, not so many it becomes noise
- Paths should be precise and crafted. Use real SVG path data for letterforms and symbols.
- NO text elements, NO foreignObject, NO image, NO clipPath, NO use, NO symbol

Return ONLY a JSON array — no markdown fences, no explanation, no extra text:
[
  {"concept": "2–4 word name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "2–4 word name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "2–4 word name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "2–4 word name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "2–4 word name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"},
  {"concept": "2–4 word name", "svg": "<svg viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"}
]`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8192,
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
