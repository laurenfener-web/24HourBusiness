import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { sql, Company } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await sql`
    SELECT * FROM companies WHERE user_id = ${session.userId}
    ORDER BY updated_at DESC LIMIT 1
  `;
  const company = (rows[0] as Company) ?? null;

  if (!company) redirect("/guide");

  const orderRows = await sql`
    SELECT status FROM filing_orders
    WHERE company_id = ${company.id}
    ORDER BY created_at DESC LIMIT 1
  `;
  const filingStatus = (orderRows[0]?.status as string) ?? null;

  return (
    <DashboardClient
      company={company}
      userEmail={session.email}
      filingStatus={filingStatus}
    />
  );
}
