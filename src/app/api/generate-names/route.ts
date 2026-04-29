import Anthropic from "@anthropic-ai/sdk";
import { promises as dns } from "dns";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function toDomain(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
}

async function checkDomain(name: string): Promise<{ domain: string; available: boolean | null }> {
  const domain = toDomain(name);
  try {
    // SOA record exists for every registered domain
    await dns.resolveSoa(domain);
    return { domain, available: false }; // resolved = taken
  } catch (e: unknown) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") {
      return { domain, available: true };
    }
    return { domain, available: null };
  }
}

async function generateBatch(
  category: string,
  description: string,
  vibe: string,
  exclude: string[]
): Promise<{ name: string; tagline: string; why: string }[]> {
  const excludeClause =
    exclude.length > 0
      ? `\n\nDo NOT suggest any of these names (already generated): ${exclude.join(", ")}`
      : "";

  const prompt = `You are a branding expert. Generate 8 creative, memorable business names for the following business idea.

${category ? `Industry / type: ${category}` : ""}
${description ? `More details: ${description}` : ""}
${vibe ? `Desired vibe/style: ${vibe}` : ""}${excludeClause}

CRITICAL: All names must be invented or uncommon words — NOT common English words like Elevate, Catalyst, Pinnacle, Nexus, Forge, Thrive, Apex, Beacon, etc. Those .com domains are all taken.

Instead use:
- Portmanteaus / blends (e.g. Snapify, Lumiax, Kynect)
- Invented spellings (e.g. Fiverr, Tumblr, Flickr)
- Unusual word combos run together (e.g. Grovelink, Dawnshift)
- Latin/Greek roots made unique (e.g. Solven, Veltrix, Kairos)
- Short, punchy invented words (5-8 letters)

Return ONLY a valid JSON array with exactly 8 objects. Each object must have:
- "name": a single invented/uncommon word (one word only)
- "tagline": a one-line tagline (under 10 words)
- "why": one sentence explaining why this name works

Example format:
[{"name":"Veltrix","tagline":"Built for what's next.","why":"Invented blend that feels modern and tech-forward."}]

Return only the JSON array, no other text.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  const { category, description, vibe } = await req.json();

  if (!category?.trim() && !description?.trim()) {
    return NextResponse.json({ error: "Please select a category or describe your business" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  try {
    type NameResult = { name: string; tagline: string; why: string; domain: string; domainAvailable: boolean | null };
    const allResults: NameResult[] = [];
    const seenNames: string[] = [];

    for (let attempt = 0; attempt < 3; attempt++) {
      const batch = await generateBatch(category, description, vibe, seenNames);
      batch.forEach((n) => seenNames.push(n.name));

      const domainChecks = await Promise.all(batch.map((n) => checkDomain(n.name)));
      const enriched = batch.map((n, i) => ({
        ...n,
        domain: domainChecks[i].domain,
        domainAvailable: domainChecks[i].available,
      }));

      allResults.push(...enriched);

      const availableCount = allResults.filter((r) => r.domainAvailable === true).length;
      if (availableCount >= 3) break;
    }

    return NextResponse.json({ names: allResults });
  } catch (err) {
    console.error("generate-names error:", err);
    return NextResponse.json({ error: "Failed to generate names" }, { status: 500 });
  }
}
