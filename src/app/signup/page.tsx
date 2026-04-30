"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="min-h-screen bg-[#1A0533] flex flex-col items-center justify-center px-6">
      <Link href="/" className="mb-10">
        <Logo dark />
      </Link>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-7">
          Save your progress and come back anytime.
        </p>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="At least 8 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            />
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#FF8C42] hover:bg-[#E87030] disabled:bg-[#FF8C42]/70 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {pending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              "Create account & start →"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF8C42] hover:text-[#E87030] font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
