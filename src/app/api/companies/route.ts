import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, Company } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT * FROM companies WHERE user_id = ${session.userId}
    ORDER BY updated_at DESC
  `;
  return NextResponse.json({ companies: rows as Company[] });
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    INSERT INTO companies (user_id) VALUES (${session.userId})
    RETURNING *
  `;
  return NextResponse.json({ company: rows[0] as Company });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  // Remove any filing orders first to avoid FK constraint errors
  await sql`DELETE FROM filing_orders WHERE company_id = ${id}`.catch(() => {});
  await sql`DELETE FROM companies WHERE id = ${id} AND user_id = ${session.userId}`;
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, current_step, structure, state, done } = await req.json();

  const rows = await sql`
    UPDATE companies
    SET
      name = COALESCE(${name}, name),
      current_step = COALESCE(${current_step}, current_step),
      structure = COALESCE(${structure}, structure),
      state = COALESCE(${state}, state),
      done = COALESCE(${done}, done),
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING *
  `;
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ company: rows[0] as Company });
}
