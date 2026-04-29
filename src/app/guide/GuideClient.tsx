"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import Step1Name from "./steps/Step1Name";
import Step2Structure from "./steps/Step2Structure";
import Step3LLC from "./steps/Step3LLC";
import Step4EIN from "./steps/Step4EIN";
import Step5Bank from "./steps/Step5Bank";
import Step6CreditCard from "./steps/Step6CreditCard";
import Step7Accounting from "./steps/Step7Accounting";
import StepLogo from "./steps/StepLogo";
import StepDomain from "./steps/StepDomain";
import StepWebsite from "./steps/StepWebsite";
import Step8Launch from "./steps/Step8Launch";
import ProfileDropdown from "@/components/ProfileDropdown";
import Logo from "@/components/Logo";
import { Company } from "@/lib/db";

interface WizardData {
  businessName: string;
  structure: string;
  state: string;
  done: boolean;
}

const STEPS = [
  { title: "Name your business", sub: "Find the perfect name" },
  { title: "Design your logo", sub: "AI-generated icon concepts", skippable: true },
  { title: "Business structure", sub: "LLC, S-Corp, or sole prop" },
  { title: "File your LLC", sub: "Official registration" },
  { title: "Get your EIN", sub: "Free from the IRS" },
  { title: "Open a bank account", sub: "Keep money separate" },
  { title: "Business credit card", sub: "Build credit & earn rewards" },
  { title: "Set up accounting", sub: "Track from day one" },
  { title: "Buy a domain", sub: "Own your web address", skippable: true },
  { title: "Build a website", sub: "Get online fast", skippable: true },
  { title: "Launch", sub: "Go get that first customer" },
];

function companyToData(company: Company): WizardData {
  return {
    businessName: company.name === "New Business" ? "" : company.name,
    structure: company.structure,
    state: company.state,
    done: company.done,
  };
}

async function saveCompany(id: string, updates: Record<string, unknown>) {
  await fetch("/api/companies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
}

interface Props {
  userEmail: string;
  initialCompanies: Company[];
  initialCompany: Company | null;
}

export default function GuideClient({ userEmail, initialCompanies, initialCompany }: Props) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [activeCompany, setActiveCompany] = useState<Company | null>(initialCompany);
  const [step, setStep] = useState(initialCompany?.current_step ?? 0);
  const [data, setData] = useState<WizardData>(
    initialCompany ? companyToData(initialCompany) : { businessName: "", structure: "llc", state: "", done: false }
  );

  async function next(updatedData?: WizardData) {
    const nextStep = Math.min(step + 1, STEPS.length - 1);
    const nextData = updatedData ?? data;
    setStep(nextStep);
    setData(nextData);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (activeCompany) {
      const updates: Record<string, unknown> = { current_step: nextStep };
      if (nextData.businessName) updates.name = nextData.businessName;
      if (nextData.structure) updates.structure = nextData.structure;
      if (nextData.state) updates.state = nextData.state;
      saveCompany(activeCompany.id, updates);
      const updated = { ...activeCompany, current_step: nextStep, ...updates } as Company;
      setActiveCompany(updated);
      setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  }

  function back() {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectCompany(company: Company) {
    setActiveCompany(company);
    setStep(company.current_step);
    setData(companyToData(company));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNewCompany(company: Company) {
    setCompanies(prev => [company, ...prev]);
    setActiveCompany(company);
    setStep(0);
    setData({ businessName: "", structure: "llc", state: "", done: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (data.done) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6">
        <div className="text-7xl mb-6">🏆</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          {data.businessName ? `${data.businessName} is officially open.` : "You're officially in business."}
        </h1>
        <p className="text-slate-400 text-lg max-w-md mb-10">
          You&apos;ve done what most people only talk about. The boring stuff is handled — now go get your first customer.
        </p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {step + 1} <span className="text-gray-300">/</span> {STEPS.length}
          </span>
        </div>
        <ProfileDropdown
          userEmail={userEmail}
          companies={companies}
          activeCompanyId={activeCompany?.id ?? ""}
          onSelectCompany={handleSelectCompany}
          onNewCompany={handleNewCompany}
        />
      </nav>

      <div className="flex flex-1">
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white border-r border-gray-100 py-8 px-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-4">Your progress</p>
          <nav className="space-y-1">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active ? "bg-indigo-50" : done ? "opacity-60" : "opacity-40"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    done || active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {done ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${active ? "text-indigo-700" : "text-gray-700"}`}>
                        {s.title}
                      </p>
                      {s.skippable && (
                        <span className="shrink-0 text-xs text-gray-400 border border-gray-200 rounded-full px-1.5 py-0.5 leading-none">
                          optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 py-10 px-6">
          <div className="max-w-xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                  Step {step + 1} of {STEPS.length}
                </p>
                {STEPS[step].skippable && (
                  <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
                    optional
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{STEPS[step].title}</h1>
              <p className="text-gray-400 mt-1">{STEPS[step].sub}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {step === 0 && <Step1Name onComplete={(d) => next({ ...data, ...d })} />}
              {step === 1 && <StepLogo businessName={data.businessName} onComplete={() => next()} />}
              {step === 2 && <Step2Structure onComplete={(d) => next({ ...data, ...d })} />}
              {step === 3 && <Step3LLC businessName={data.businessName} onComplete={(d) => next({ ...data, ...d })} />}
              {step === 4 && <Step4EIN businessName={data.businessName} onComplete={() => next()} />}
              {step === 5 && <Step5Bank onComplete={() => next()} />}
              {step === 6 && <Step6CreditCard onComplete={() => next()} />}
              {step === 7 && <Step7Accounting onComplete={() => next()} />}
              {step === 8 && <StepDomain businessName={data.businessName} onComplete={() => next()} />}
              {step === 9 && <StepWebsite onComplete={() => next()} />}
              {step === 10 && (
                <Step8Launch
                  businessName={data.businessName}
                  userEmail={userEmail}
                  onComplete={() => {
                    const nd = { ...data, done: true };
                    setData(nd);
                    if (activeCompany) saveCompany(activeCompany.id, { done: true });
                  }}
                />
              )}
            </div>

            {step > 0 && (
              <button
                onClick={back}
                className="mt-5 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mx-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Back to previous step
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
