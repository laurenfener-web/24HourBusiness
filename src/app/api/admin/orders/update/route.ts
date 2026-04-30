import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.email !== "laurenfener@gmail.com") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status } = await req.json();
  await sql`
    UPDATE filing_orders
    SET status = ${status}, filed_at = ${status === "filed" ? new Date().toISOString() : null}, updated_at = NOW()
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}
