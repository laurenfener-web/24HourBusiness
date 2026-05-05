"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import Step1Name from "./steps/Step1Name";
import StepSelectState from "./steps/StepSelectState";
import Step2Structure from "./steps/Step2Structure";
import StepFilingDetails from "./steps/StepFilingDetails";
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
  { title: "Select your state", sub: "Where you'll file" },
  { title: "Business structure", sub: "Choose the right entity" },
  { title: "File your LLC", sub: "We handle the paperwork" },
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
  const [step, setStep] = useState(Math.min(initialCompany?.current_step ?? 0, STEPS.length - 1));
  const [data, setData] = useState<WizardData>(
    initialCompany ? companyToData(initialCompany) : { businessName: "", structure: "llc", state: "", done: false }
  );

  useEffect(() => {
    if (data.done) window.location.href = "/dashboard";
  }, [data.done]);

  async function next(updatedData?: WizardData) {
    const nextData = updatedData ?? data;
    setData(nextData);

    if (step === STEPS.length - 1) {
      if (activeCompany) await saveCompany(activeCompany.id, { done: true });
      window.location.href = "/dashboard";
      return;
    }

    const nextStep = step + 1;
    setStep(nextStep);
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
    setStep(Math.min(company.current_step, STEPS.length - 1));
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

  function handleDeleteCompany(id: string) {
    const remaining = companies.filter(c => c.id !== id);
    setCompanies(remaining);
    if (activeCompany?.id === id) {
      const fallback = remaining[0] ?? null;
      setActiveCompany(fallback);
      setStep(Math.min(fallback?.current_step ?? 0, STEPS.length - 1));
      setData(fallback ? companyToData(fallback) : { businessName: "", structure: "llc", state: "", done: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A0533] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Ready to start a business?</h1>
        <p className="text-white/60 text-sm mb-6">You don&apos;t have any in progress. Let&apos;s build one.</p>
        <button
          onClick={async () => {
            const res = await fetch("/api/companies", { method: "POST" });
            const newData = await res.json();
            handleNewCompany(newData.company);
          }}
          className="bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Start a new business
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
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
          onDeleteCompany={handleDeleteCompany}
        />
      </nav>

      <div className="flex flex-1">
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 py-8 px-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-4">Setup</p>
          <nav className="space-y-1">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active ? "bg-[#D4AF37]/10" : done ? "opacity-60" : "opacity-40"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    done || active ? "bg-[#D4AF37] text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {done ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${active ? "text-[#B8962E]" : "text-gray-700"}`}>
                      {s.title}
                    </p>
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
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mt-1">{STEPS[step].title}</h1>
              <p className="text-gray-400 mt-1">{STEPS[step].sub}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {step === 0 && <Step1Name onComplete={(d) => next({ ...data, ...d })} />}
              {step === 1 && <StepSelectState onComplete={(d) => next({ ...data, ...d })} />}
              {step === 2 && <Step2Structure onComplete={(d) => next({ ...data, ...d })} />}
              {step === 3 && (
                <StepFilingDetails
                  businessName={data.businessName}
                  state={data.state}
                  structure={data.structure}
                  companyId={activeCompany?.id ?? ""}
                  userEmail={userEmail}
                  onComplete={() => next()}
                />
              )}
            </div>

            {step > 0 && (
              <button
                onClick={back}
                className="mt-5 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mx-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
