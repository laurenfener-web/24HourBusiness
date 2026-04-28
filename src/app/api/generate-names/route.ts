import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function toDomain(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
}

async function checkDomain(name: string): Promise<{ domain: string; available: boolean | null }> {
  const domain = toDomain(name);
  try {
    const res = await fetch(`https://rdap.verisign.com/com/v1/domain/${domain}`, {
      signal: AbortSignal.timeout(4000),
    });
    // 200 = registered (taken), 404 = not found (available)
    return { domain, available: res.status === 404 };
  } catch {
    return { domain, available: null }; // null = couldn't check
  }
}

export async function POST(req: NextRequest) {
  const { description, vibe } = await req.json();

  if (!description?.trim()) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  const prompt = `You are a branding expert. Generate 8 creative, memorable business names for the following business idea.

Business description: ${description}
${vibe ? `Desired vibe/style: ${vibe}` : ""}

Return ONLY a valid JSON array with exactly 8 objects. Each object must have:
- "name": the business name (2-4 words max, punchy and memorable)
- "tagline": a one-line tagline (under 10 words)
- "why": one sentence explaining why this name works

Example format:
[{"name":"Example Co","tagline":"Doing things differently.","why":"Short and instantly memorable."}]

Return only the JSON array, no other text.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const names: { name: string; tagline: string; why: string }[] = JSON.parse(cleaned);

    // Check domain availability for all names in parallel
    const domainChecks = await Promise.all(names.map((n) => checkDomain(n.name)));

    const enriched = names.map((n, i) => ({
      ...n,
      domain: domainChecks[i].domain,
      domainAvailable: domainChecks[i].available,
    }));

    return NextResponse.json({ names: enriched });
  } catch (err) {
    console.error("generate-names error:", err);
    return NextResponse.json({ error: "Failed to generate names" }, { status: 500 });
  }
}
