"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import Step1Name from "./steps/Step1Name";
import StepLogo from "./steps/StepLogo";
import StepSelectState from "./steps/StepSelectState";
import StepGetOfficial from "./steps/StepGetOfficial";
import Step5Bank from "./steps/Step5Bank";
import Step6CreditCard from "./steps/Step6CreditCard";
import Step7Accounting from "./steps/Step7Accounting";
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
  { title: "Select your state", sub: "Laws vary by state" },
  { title: "Get official", sub: "Structure, filing & tax ID" },
  { title: "Open a bank account", sub: "Keep money separate" },
  { title: "Business credit card", sub: "Build credit & earn rewards" },
  { title: "Set up accounting", sub: "Track from day one", skippable: true },
  { title: "Buy a domain", sub: "Own your web address", skippable: true },
  { title: "Build a website", sub: "Get online fast", skippable: true },
  { title: "Launch", sub: "Go get that first customer" },
];

const OFFICIAL_STEP = 3;

export type SubStepKind =
  | "structure"
  | "name-check"
  | "file"
  | "ein"
  | "statement-of-info"
  | "publish"
  | "cert-of-pub";

export interface OfficialSubStepDef {
  kind: SubStepKind;
  title: string;
  hint?: string;
  optional?: boolean;
}

// Per-state ordering of the "Get official" sub-steps.
// EIN is placed where it makes most sense given processing time:
//   - CA & NY: after filing (do EIN during the processing wait)
//   - FL & TX: after filing (same-day processing, EIN follows immediately)
export const OFFICIAL_SUBSTEPS: Record<string, OfficialSubStepDef[]> = {
  California: [
    { kind: "structure", title: "Business structure" },
    { kind: "name-check", title: "Reserve your name", optional: true },
    { kind: "file", title: "File Articles" },
    { kind: "ein", title: "Get your EIN", hint: "Do this during your 3–5 day wait" },
    { kind: "statement-of-info", title: "Statement of Information" },
  ],
  "New York": [
    { kind: "structure", title: "Business structure" },
    { kind: "file", title: "File Articles" },
    { kind: "ein", title: "Get your EIN", hint: "Do this during your 2–3 week wait" },
    { kind: "publish", title: "Publish notice" },
    { kind: "cert-of-pub", title: "Certificate of Publication" },
  ],
  Florida: [
    { kind: "structure", title: "Business structure" },
    { kind: "file", title: "File with Florida" },
    { kind: "ein", title: "Get your EIN" },
  ],
  Texas: [
    { kind: "structure", title: "Business structure" },
    { kind: "file", title: "File Certificate" },
    { kind: "ein", title: "Get your EIN" },
  ],
};

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
  const [officialSubStep, setOfficialSubStep] = useState(0);
  const [data, setData] = useState<WizardData>(
    initialCompany ? companyToData(initialCompany) : { businessName: "", structure: "llc", state: "", done: false }
  );

  async function next(updatedData?: WizardData) {
    const nextStep = Math.min(step + 1, STEPS.length - 1);
    const nextData = updatedData ?? data;
    setStep(nextStep);
    setData(nextData);
    setOfficialSubStep(0);
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
    setOfficialSubStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectCompany(company: Company) {
    setActiveCompany(company);
    setStep(Math.min(company.current_step, STEPS.length - 1));
    setOfficialSubStep(0);
    setData(companyToData(company));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNewCompany(company: Company) {
    setCompanies(prev => [company, ...prev]);
    setActiveCompany(company);
    setStep(0);
    setOfficialSubStep(0);
    setData({ businessName: "", structure: "llc", state: "", done: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteCompany(id: string) {
    const remaining = companies.filter(c => c.id !== id);
    setCompanies(remaining);
    if (activeCompany?.id === id) {
      const next = remaining[0] ?? null;
      setActiveCompany(next);
      setStep(Math.min(next?.current_step ?? 0, STEPS.length - 1));
      setOfficialSubStep(0);
      setData(next ? companyToData(next) : { businessName: "", structure: "llc", state: "", done: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleStructureChange(structure: string) {
    const newData = { ...data, structure };
    setData(newData);
    if (activeCompany) saveCompany(activeCompany.id, { structure });
  }

  const officialSubSteps = OFFICIAL_SUBSTEPS[data.state];

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A0533] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Ready to start a business?</h1>
        <p className="text-white/60 text-sm mb-6">You don&apos;t have any in progress. Let&apos;s build one.</p>
        <button
          onClick={async () => {
            const res = await fetch("/api/companies", { method: "POST" });
            const data = await res.json();
            handleNewCompany(data.company);
          }}
          className="bg-[#FF8C42] hover:bg-[#E87030] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Start a new business
        </button>
      </div>
    );
  }

  if (data.done) {
    return (
      <div className="min-h-screen bg-[#1A0533] flex flex-col items-center justify-center text-center px-6">
        <div className="text-7xl mb-6">🏆</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          {data.businessName ? `${data.businessName} is officially open.` : "You're officially in business."}
        </h1>
        <p className="text-slate-400 text-lg max-w-md mb-10">
          You&apos;ve done what most people only talk about. The boring stuff is handled — now go get your first customer.
        </p>
        <Link href="/" className="text-[#FF8C42] hover:text-[#FF8C42]/70 text-sm font-medium transition-colors">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1A0533]">
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF8C42] rounded-full transition-all duration-500"
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
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white border-r border-gray-100 py-8 px-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-4">Your progress</p>
          <nav className="space-y-1">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              const isOfficialStep = i === OFFICIAL_STEP;
              const showSubSteps = isOfficialStep && officialSubSteps && officialSubSteps.length > 0 && (active || done);

              return (
                <div key={i}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      active ? "bg-[#FF8C42]/10" : done ? "opacity-60" : "opacity-40"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      done || active ? "bg-[#FF8C42] text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {done ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${active ? "text-[#E87030]" : "text-gray-700"}`}>
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

                  {showSubSteps && (
                    <div className="ml-8 mt-1 mb-1 space-y-1">
                      {officialSubSteps.map((sub, si) => {
                        const subDone = done || si < officialSubStep;
                        const subActive = active && si === officialSubStep;
                        return (
                          <div key={si} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${subActive ? "bg-[#FF8C42]/10" : ""}`}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              subDone ? "bg-[#FF8C42]" : subActive ? "border-2 border-[#FF8C42]" : "border-2 border-gray-200"
                            }`}>
                              {subDone && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs font-medium truncate ${subActive ? "text-[#E87030]" : subDone ? "text-gray-500" : "text-gray-400"}`}>
                                {sub.title}
                                {sub.optional && <span className="ml-1 text-gray-300">(optional)</span>}
                              </p>
                              {sub.hint && subActive && (
                                <p className="text-xs text-[#FF8C42] truncate italic">{sub.hint}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 py-10 px-6">
          <div className="max-w-xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF8C42]">
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
              {step === 2 && <StepSelectState onComplete={(d) => next({ ...data, ...d })} />}
              {step === OFFICIAL_STEP && (
                <StepGetOfficial
                  businessName={data.businessName}
                  state={data.state}
                  structure={data.structure}
                  subStep={officialSubStep}
                  onSubStepChange={setOfficialSubStep}
                  onStructureChange={handleStructureChange}
                  onComplete={() => next()}
                  companyId={activeCompany?.id ?? ""}
                  userEmail={userEmail}
                />
              )}
              {step === 4 && <Step5Bank onComplete={() => next()} />}
              {step === 5 && <Step6CreditCard onComplete={() => next()} />}
              {step === 6 && <Step7Accounting onComplete={() => next()} />}
              {step === 7 && <StepDomain businessName={data.businessName} onComplete={() => next()} />}
              {step === 8 && <StepWebsite onComplete={() => next()} />}
              {step === 9 && (
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
