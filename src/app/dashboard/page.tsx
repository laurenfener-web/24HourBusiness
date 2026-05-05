import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { sql, Company } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export interface FilingOrderSummary {
  status: string;
  state: string;
  paid_at: string | null;
  filed_at: string | null;
  approved_at: string | null;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await sql`
    SELECT * FROM companies WHERE user_id = ${session.userId}
    ORDER BY updated_at DESC LIMIT 1
  `;
  const company = (rows[0] as Company) ?? null;

  if (!company) redirect("/guide");

  let filingOrder: FilingOrderSummary | null = null;
  try {
    const orderRows = await sql`
      SELECT status, state, created_at as paid_at, filed_at, approved_at
      FROM filing_orders
      WHERE company_id = ${company.id}
      ORDER BY created_at DESC LIMIT 1
    `;
    if (orderRows[0]) {
      filingOrder = orderRows[0] as FilingOrderSummary;
    }
  } catch {
    // filing_orders table may not exist yet
  }

  return (
    <DashboardClient
      company={company}
      userEmail={session.email}
      filingOrder={filingOrder}
    />
  );
}
