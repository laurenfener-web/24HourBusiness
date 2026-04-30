import Link from "next/link";
import { ArrowRight, Building2, CreditCard, FileText, Globe, Landmark, Sparkles } from "lucide-react";
import { getSession } from "@/lib/session";
import { sql, Company } from "@/lib/db";
import HomeNav from "@/components/HomeNav";
import Logo from "@/components/Logo";

const OUTCOMES = [
  {
    icon: Sparkles,
    title: "A name you love",
    desc: "With an available .com — AI-generated and domain-checked in seconds.",
  },
  {
    icon: Building2,
    title: "An official LLC",
    desc: "Filed with your state. Real, legal, yours.",
  },
  {
    icon: FileText,
    title: "Your EIN",
    desc: "Your business's tax ID from the IRS — free, and takes 10 minutes.",
  },
  {
    icon: Landmark,
    title: "A business bank account",
    desc: "Money goes in, money goes out — all under your business name.",
  },
  {
    icon: Globe,
    title: "Your domain",
    desc: "yourbusiness.com, yours. Never lose it to a squatter.",
  },
  {
    icon: CreditCard,
    title: "A business card",
    desc: "Build credit and earn rewards on every dollar you spend.",
  },
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
    <div className="flex flex-col min-h-screen bg-[#1A0533]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A0533]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo dark />
          {session ? (
            <HomeNav userEmail={session.email} companies={companies} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white px-3 py-2 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="flex items-center gap-1.5 bg-[#FF8C42] hover:bg-[#E87030] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Start free <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1A0533] text-white min-h-screen flex flex-col items-center justify-center pt-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42]/70 text-sm font-medium px-4 py-1.5 rounded-full mb-10">
            <span className="w-1.5 h-1.5 bg-[#FF8C42] rounded-full animate-pulse" />
            Free · No credit card · Done tonight
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-8">
            You&apos;re going to be a{" "}
            <span className="text-[#FF8C42]">business owner</span>{" "}
            by the end of tonight.
          </h1>

          <p className="text-xl text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
            Not someday. Tonight. We handle the paperwork — you focus on the idea.
          </p>

          <Link
            href={session ? "/guide" : "/signup"}
            className="inline-flex items-center gap-2.5 bg-[#FF8C42] hover:bg-[#E87030] text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all shadow-2xl shadow-[#FF8C42]/30 hover:shadow-[#FF8C42]/50 hover:scale-105 active:scale-100"
          >
            {session ? "Keep going" : "Open my business"} <ArrowRight className="w-6 h-6" />
          </Link>

          <p className="mt-5 text-sm text-slate-600">
            {session ? `Welcome back, ${session.email}` : "No credit card. No catch. Just your business."}
          </p>
        </div>
      </section>

      {/* Bridge */}
      <section className="bg-[#220840] px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            Most people spend months{" "}
            <span className="text-[#7A5A9A]">thinking about starting.</span>
          </p>
          <p className="text-4xl sm:text-5xl font-black text-white leading-tight">
            You&apos;ll be done{" "}
            <span className="text-[#FF8C42]">before you go to sleep.</span>
          </p>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-[#1A0533] px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              By tonight, you&apos;ll have all of this.
            </h2>
            <p className="text-white/60 text-lg">Real things. Yours. Official.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OUTCOMES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/8 transition-colors">
                <div className="w-11 h-11 bg-[#FF8C42]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#FF8C42]" />
                </div>
                <p className="font-bold text-white text-lg mb-1">{title}</p>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1A0533] px-6 py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Your business is one evening away.
          </h2>
          <p className="text-slate-400 text-xl mb-12">
            Stop waiting for the perfect moment. This is it.
          </p>
          <Link
            href={session ? "/guide" : "/signup"}
            className="inline-flex items-center gap-2.5 bg-[#FF8C42] hover:bg-[#E87030] text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all shadow-2xl shadow-[#FF8C42]/30 hover:scale-105 active:scale-100"
          >
            {session ? "Continue where I left off" : "Open my business tonight"} <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-5 text-sm text-slate-600">Free. Always.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A0533] border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo dark size="sm" />
          <p className="text-sm text-slate-600">Built for the founder who&apos;s ready right now.</p>
        </div>
      </footer>
    </div>
  );
}
