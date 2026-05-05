"use client";

import Link from "next/link";
import { ExternalLink, LogOut, FileText } from "lucide-react";
import { logout } from "@/actions/auth";
import Logo from "@/components/Logo";

interface Company {
  id: string;
  name: string;
  structure: string;
  state: string;
  done: boolean;
}

const STRUCTURE_LABELS: Record<string, string> = {
  llc: "LLC",
  scorp: "S-Corp",
  ccorp: "C-Corp",
  sole: "Sole Proprietorship",
};

const TASKS = [
  {
    emoji: "🏦",
    title: "Open a bank account",
    desc: "Keep business and personal money separate from day one. Mercury is the go-to for startups — no fees, no minimums.",
    cta: "Open with Mercury",
    href: "https://mercury.com",
  },
  {
    emoji: "💳",
    title: "Get a business credit card",
    desc: "Build business credit and earn rewards. Ramp has no fees, great cashback, and easy controls.",
    cta: "Apply at Ramp",
    href: "https://ramp.com",
  },
  {
    emoji: "📊",
    title: "Set up accounting",
    desc: "Track income and expenses from the start. Wave is free for small businesses and handles the basics well.",
    cta: "Start with Wave",
    href: "https://waveapps.com",
  },
  {
    emoji: "🌐",
    title: "Buy a domain",
    desc: "Own your web address before someone else does. Namecheap is cheap, reliable, and doesn't upsell you to death.",
    cta: "Search on Namecheap",
    href: "https://namecheap.com",
  },
  {
    emoji: "🖥️",
    title: "Build a website",
    desc: "Get a professional page online in an hour. Carrd is dead simple and costs next to nothing.",
    cta: "Build on Carrd",
    href: "https://carrd.co",
  },
  {
    emoji: "🛡️",
    title: "Get business insurance",
    desc: "General liability protects you if something goes wrong. Next Insurance is fast, affordable, and built for small businesses.",
    cta: "Quote with Next",
    href: "https://next-insurance.com",
  },
  {
    emoji: "📣",
    title: "Tell 10 people",
    desc: "Your first customers are probably people you already know. Send a personal note — not a blast, a real message.",
    cta: "Open email",
    href: "mailto:?subject=I%20just%20launched%20my%20business",
  },
];

interface Props {
  company: Company;
  userEmail: string;
  filingStatus: string | null;
}

export default function DashboardClient({ company, userEmail, filingStatus }: Props) {
  const structure = STRUCTURE_LABELS[company.structure] ?? company.structure.toUpperCase();
  const hasFiling = filingStatus !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-gray-400">{userEmail}</span>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Business header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Your business</p>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {company.name || "Your Business"}
          </h1>
          <p className="text-gray-400 mt-1 text-lg">
            {structure}{company.state ? ` · ${company.state}` : ""}
          </p>
        </div>

        {/* Filing status */}
        {hasFiling ? (
          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <FileText className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Filing in progress</p>
              <p className="text-sm text-gray-500 mt-0.5">
                We&apos;re handling the paperwork for {company.name || "your LLC"}. You&apos;ll get an email when it&apos;s submitted and again when it&apos;s approved.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <FileText className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">File your LLC</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  You chose to file yourself — or haven&apos;t filed yet. Go back to the guide to file or have us do it for you.
                </p>
              </div>
            </div>
            <Link
              href="/guide"
              className="shrink-0 text-sm font-semibold text-[#D4AF37] hover:text-[#B8962E] transition-colors whitespace-nowrap"
            >
              Go to guide
            </Link>
          </div>
        )}

        {/* Next steps */}
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Next steps</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TASKS.map((task) => (
            <a
              key={task.title}
              href={task.href}
              target={task.href.startsWith("mailto") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#D4AF37]/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-2xl leading-none">{task.emoji}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#D4AF37] transition-colors shrink-0 mt-1" />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{task.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{task.desc}</p>
              <p className="text-xs font-semibold text-[#D4AF37]">{task.cta} →</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
