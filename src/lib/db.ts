import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT 'New Business',
      current_step INT NOT NULL DEFAULT 0,
      structure TEXT NOT NULL DEFAULT 'llc',
      state TEXT NOT NULL DEFAULT '',
      done BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE OR REPLACE VIEW companies_with_email AS
    SELECT
      c.id,
      c.name,
      u.email,
      c.structure,
      c.state,
      c.current_step,
      c.done,
      c.created_at,
      c.updated_at
    FROM companies c
    JOIN users u ON c.user_id = u.id
  `;
}

export async function initOrdersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS filing_orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID REFERENCES companies(id),
      user_email TEXT NOT NULL,
      business_name TEXT NOT NULL,
      state TEXT NOT NULL,
      structure TEXT NOT NULL,
      organizer_name TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      city TEXT NOT NULL,
      zip TEXT NOT NULL,
      phone TEXT DEFAULT '',
      stripe_session_id TEXT,
      amount_cents INT NOT NULL,
      details TEXT,
      notes TEXT DEFAULT '',
      confirmation_number TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending_payment',
      filed_at TIMESTAMPTZ,
      approved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Add columns to existing tables that were created before this schema version
  await sql`ALTER TABLE filing_orders ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT ''`;
  await sql`ALTER TABLE filing_orders ADD COLUMN IF NOT EXISTS confirmation_number TEXT DEFAULT ''`;
  await sql`ALTER TABLE filing_orders ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ`;
}

export interface FilingOrder {
  id: string;
  company_id: string;
  user_email: string;
  business_name: string;
  state: string;
  structure: string;
  organizer_name: string;
  address_line1: string;
  city: string;
  zip: string;
  phone: string;
  stripe_session_id: string | null;
  amount_cents: number;
  details: string | null;
  notes: string;
  confirmation_number: string;
  status: string;
  filed_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  current_step: number;
  structure: string;
  state: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}
