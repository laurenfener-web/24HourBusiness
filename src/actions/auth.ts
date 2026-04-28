"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = { error?: string } | undefined;

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) return { error: "An account with this email already exists." };

  const hashed = await bcrypt.hash(password, 12);
  const result = await sql`
    INSERT INTO users (email, password) VALUES (${email}, ${hashed})
    RETURNING id
  `;

  await createSession(result[0].id, email);
  redirect("/guide");
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  const users = await sql`SELECT id, password FROM users WHERE email = ${email}`;
  if (users.length === 0) return { error: "No account found with that email." };

  const match = await bcrypt.compare(password, users[0].password);
  if (!match) return { error: "Incorrect password." };

  await createSession(users[0].id, email);
  redirect("/guide");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
