import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield, Zap } from "lucide-react";
import { getSession } from "@/lib/session";
import { sql, Company } from "@/lib/db";
import HomeNav from "@/components/HomeNav";
import Logo from "@/components/Logo";

const STEPS = [
  { num: "01", title: "Name your business", desc: "AI-powered name generator checks .com availability in real time." },
  { num: "02", title: "Choose your structure", desc: "LLC, S-Corp, or sole proprietor — we explain each so you can decide with confidence." },
  { num: "03", title: "File your LLC", desc: "State-by-state filing guide with exact links, fees, and processing times." },
  { num: "04", title: "Get your EIN", desc: "Free from the IRS, takes 10 minutes. We walk you through every field." },
  { num: "05", title: "Open a bank account", desc: "Keep business and personal money separate from day one." },
  { num: "06", title: "Get a business credit card", desc: "Build business credit and earn rewards on every dollar you spend." },
  { num: "07", title: "Set up accounting", desc: "The right tool from the start saves you thousands at tax time." },
  { num: "08", title: "Buy a domain", desc: "Own your web address. We suggest one based on your business name." },
  { num: "09", title: "Build a website", desc: "Get online fast with the right builder for your needs and budget." },
  { num: "10", title: "Launch", desc: "Get your first customer. The paperwork is done — now the real work begins." },
];

const PILLARS = [
  { icon: Zap, label: "Completely free", desc: "No account, no credit card, no upsells." },
  { icon: Clock, label: "One weekend", desc: "Most people finish in under 48 hours." },
  { icon: Shield, label: "Expert guidance", desc: "Every step explained in plain English." },
];

export default async function Home() {
  const session = await getSession();
  let companies: Company[] = [];
  if (session) {
    try {
      const rows = await sql`SELECT * FROM companies WHERE user_id = ${session.userId} ORDER BY updated_at DESC`;
      companies = rows as Company[];
    } catch {}
  }
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          {session ? (
            <HomeNav userEmail={session.email} companies={companies} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Sign up free <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-950 text-white pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            Free · No account required · Takes one weekend
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Stop thinking about it.{" "}
            <span className="text-indigo-400">Start your business.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            10 guided steps from idea to official business. Name, LLC, EIN, bank account, domain, website — we walk you through every single one, in plain English.
          </p>
          <Link
            href={session ? "/guide" : "/signup"}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-indigo-500/25"
          >
            {session ? "Continue your guide" : "Start for free"} <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-slate-500">{session ? `Logged in as ${session.email}` : "Free account. No credit card."}</p>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8">
          {PILLARS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">The 10-step process</p>
            <h2 className="text-3xl font-bold text-gray-900">Everything you need, in order.</h2>
            <p className="text-gray-500 mt-3 text-lg">No guesswork. No rabbit holes. Just the next step.</p>
          </div>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="bg-white border border-gray-100 rounded-2xl px-6 py-5 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl font-black text-indigo-100 tabular-nums leading-none mt-0.5 select-none">
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                </div>
                {i === 0 && (
                  <span className="shrink-0 text-xs font-semibold bg-indigo-600 text-white px-2.5 py-1 rounded-full">
                    AI-powered
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Let&apos;s get started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Built to help you stop waiting and start building.
          </p>
        </div>
      </footer>
    </div>
  );
}
