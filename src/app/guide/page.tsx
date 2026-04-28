import { getSession } from "@/lib/session";
import { sql, Company } from "@/lib/db";
import GuideClient from "./GuideClient";

export default async function GuidePage() {
  const session = await getSession();

  let companies: Company[] = [];
  if (session) {
    const rows = await sql`
      SELECT * FROM companies WHERE user_id = ${session.userId}
      ORDER BY updated_at DESC
    `;
    companies = rows as Company[];

    if (companies.length === 0) {
      const newRows = await sql`
        INSERT INTO companies (user_id) VALUES (${session.userId})
        RETURNING *
      `;
      companies = newRows as Company[];
    }
  }

  return (
    <GuideClient
      userEmail={session?.email ?? ""}
      initialCompanies={companies}
      initialCompany={companies[0] ?? null}
    />
  );
}
