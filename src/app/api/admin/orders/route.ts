import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initOrdersTable } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (session?.email !== "laurenfener@gmail.com") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await initOrdersTable();

  const orders = await sql`
    SELECT * FROM filing_orders ORDER BY created_at DESC
  `;
  return NextResponse.json(orders);
}
