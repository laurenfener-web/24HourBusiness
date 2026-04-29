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
