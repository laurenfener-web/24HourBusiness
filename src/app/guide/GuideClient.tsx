"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import Step1Name from "./steps/Step1Name";
import Step2Structure from "./steps/Step2Structure";
import Step3LLC from "./steps/Step3LLC";
import Step4EIN from "./steps/Step4EIN";
import Step5Bank from "./steps/Step5Bank";
import Step6CreditCard from "./steps/Step6CreditCard";
import Step7Accounting from "./steps/Step7Accounting";
import Step8Launch from "./steps/Step8Launch";

interface State {
  businessName: string;
  structure: string;
  state: string;
  done: boolean;
}

const STEPS = [
  { title: "Name your business", sub: "Find the perfect name" },
  { title: "Business structure", sub: "LLC, S-Corp, or sole prop" },
  { title: "File your LLC", sub: "Official registration" },
  { title: "Get your EIN", sub: "Free from the IRS" },
  { title: "Open a bank account", sub: "Keep money separate" },
  { title: "Business credit card", sub: "Build credit & earn rewards" },
  { title: "Set up accounting", sub: "Track from day one" },
  { title: "Launch", sub: "Go get that first customer" },
];

export default function GuideClient() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<State>({ businessName: "", structure: "llc", state: "", done: false });

  useEffect(() => {
    const saved = localStorage.getItem("24hb-progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.step !== undefined) setStep(parsed.step);
      if (parsed.data) setData(parsed.data);
    }
  }, []);

  function save(newStep: number, newData: State) {
    localStorage.setItem("24hb-progress", JSON.stringify({ step: newStep, data: newData }));
  }

  function next(updatedData?: State) {
    const nextStep = Math.min(step + 1, STEPS.length - 1);
    const nextData = updatedData ?? data;
    setStep(nextStep);
    setData(nextData);
    save(nextStep, nextData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    const prevStep = Math.max(step - 1, 0);
    setStep(prevStep);
    save(prevStep, data);
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
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">24</span>
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">HourBusiness</span>
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
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
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
                    done
                      ? "bg-indigo-600 text-white"
                      : active
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {done ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${active ? "text-indigo-700" : "text-gray-700"}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-10 px-6">
          <div className="max-w-xl mx-auto">
            {/* Step header */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {STEPS[step].title}
              </h1>
              <p className="text-gray-400 mt-1">{STEPS[step].sub}</p>
            </div>

            {/* Step content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {step === 0 && (
                <Step1Name onComplete={(d) => { const nd = { ...data, ...d }; next(nd); }} />
              )}
              {step === 1 && (
                <Step2Structure onComplete={(d) => { const nd = { ...data, ...d }; next(nd); }} />
              )}
              {step === 2 && (
                <Step3LLC businessName={data.businessName} onComplete={(d) => { const nd = { ...data, ...d }; next(nd); }} />
              )}
              {step === 3 && (
                <Step4EIN businessName={data.businessName} onComplete={() => next()} />
              )}
              {step === 4 && <Step5Bank onComplete={() => next()} />}
              {step === 5 && <Step6CreditCard onComplete={() => next()} />}
              {step === 6 && <Step7Accounting onComplete={() => next()} />}
              {step === 7 && (
                <Step8Launch businessName={data.businessName} onComplete={() => {
                  const nd = { ...data, done: true };
                  setData(nd);
                  save(step, nd);
                }} />
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
