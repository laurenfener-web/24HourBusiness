"use client";

import Link from "next/link";
import { ExternalLink, LogOut, Check } from "lucide-react";
import { logout } from "@/actions/auth";
import Logo from "@/components/Logo";
import type { FilingOrderSummary } from "./page";

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

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function FilingTracker({ order, businessName, state }: { order: FilingOrderSummary; businessName: string; state: string }) {
  const stages: { label: string; sub: string; date: string | null; done: boolean; active: boolean }[] = [
    {
      label: "Payment received",
      sub: "We have your filing request",
      date: fmt(order.paid_at),
      done: true,
      active: order.status === "paid",
    },
    {
      label: `Filed with ${state}`,
      sub: order.filed_at ? "Articles of Organization submitted" : "Filing in progress — we're on it",
      date: fmt(order.filed_at),
      done: !!order.filed_at,
      active: order.status === "filed",
    },
    {
      label: "State approved",
      sub: order.approved_at ? `${businessName} is officially an LLC` : "Awaiting state confirmation",
      date: fmt(order.approved_at),
      done: !!order.approved_at,
      active: order.status === "approved",
    },
  ];

  const currentIdx = stages.findIndex(s => s.active);
  const doneCount = stages.filter(s => s.done).length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 text-sm">LLC Filing Status</p>
          <p className="text-xs text-gray-400 mt-0.5">We&apos;ll email you at each stage</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          order.status === "approved"
            ? "bg-emerald-100 text-emerald-700"
            : order.status === "filed"
              ? "bg-blue-100 text-blue-700"
              : "bg-amber-100 text-amber-700"
        }`}>
          {order.status === "approved" ? "Approved" : order.status === "filed" ? "Filed" : "In progress"}
        </span>
      </div>

      {/* Pipeline */}
      <div className="px-6 py-6">
        <div className="relative">
          {/* Progress bar behind circles */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" style={{ zIndex: 0 }}>
            <div
              className="h-full bg-[#D4AF37] transition-all duration-700"
              style={{ width: doneCount === 1 ? "0%" : doneCount === 2 ? "50%" : doneCount === 3 ? "100%" : "0%" }}
            />
          </div>

          <div className="relative grid grid-cols-3 gap-2" style={{ zIndex: 1 }}>
            {stages.map((stage, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                {/* Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  stage.done
                    ? "bg-[#D4AF37] border-[#D4AF37]"
                    : stage.active
                      ? "bg-white border-[#D4AF37]"
                      : "bg-white border-gray-200"
                }`}>
                  {stage.done ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : stage.active ? (
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-200" />
                  )}
                </div>

                {/* Labels */}
                <div>
                  <p className={`text-xs font-bold leading-tight ${stage.done || stage.active ? "text-gray-900" : "text-gray-400"}`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{stage.sub}</p>
                  {stage.date && (
                    <p className="text-xs font-semibold text-[#D4AF37] mt-1">{stage.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      {!order.approved_at && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            {order.status === "paid"
              ? "We typically file within 1 business day of receiving your order."
              : "State processing times vary. California: 3–5 days · Florida: same day · New York: 2–3 weeks · Texas: same day."}
          </p>
        </div>
      )}
    </div>
  );
}

interface Props {
  company: Company;
  userEmail: string;
  filingOrder: FilingOrderSummary | null;
}

export default function DashboardClient({ company, userEmail, filingOrder }: Props) {
  const structure = STRUCTURE_LABELS[company.structure] ?? company.structure.toUpperCase();

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
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Your business</p>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {company.name || "Your Business"}
          </h1>
          <p className="text-gray-400 mt-1 text-lg">
            {structure}{company.state ? ` · ${company.state}` : ""}
          </p>
        </div>

        {/* Filing status tracker */}
        {filingOrder ? (
          <FilingTracker
            order={filingOrder}
            businessName={company.name}
            state={company.state}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">File your LLC</p>
              <p className="text-sm text-gray-500 mt-0.5">
                You chose to file yourself. Go back anytime to have us handle it.
              </p>
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
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Build your business</p>
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
