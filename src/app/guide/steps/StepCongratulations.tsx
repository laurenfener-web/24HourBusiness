"use client";

import { ArrowRight, Check } from "lucide-react";

interface Props {
  businessName: string;
  state: string;
  structure: string;
  onComplete: () => void;
}

const STRUCTURE_LABELS: Record<string, string> = {
  llc: "LLC",
  scorp: "S-Corp",
  ccorp: "C-Corp",
  sole: "Sole Proprietorship",
};

export default function StepCongratulations({ businessName, state, structure, onComplete }: Props) {
  const structureLabel = STRUCTURE_LABELS[structure] ?? structure.toUpperCase();

  const milestones = [
    { label: "Named your business", done: !!businessName },
    { label: `Chose your state — ${state || "selected"}`, done: !!state },
    { label: `Set up as a ${structureLabel}`, done: true },
    { label: "Filed your LLC", done: true },
    { label: "Applied for your EIN", done: true },
  ];

  return (
    <div className="space-y-8 text-center">
      {/* Hero */}
      <div className="py-4">
        <div className="text-7xl mb-5">🏆</div>
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
          {businessName ? `${businessName} is ready.` : "You're ready."}
        </h2>
        <p className="text-gray-400 mt-3 leading-relaxed max-w-xs mx-auto">
          Most people spend months thinking about starting a business. You just did it.
        </p>
      </div>

      {/* Milestones */}
      <div className="text-left bg-gray-50 rounded-2xl px-5 py-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">What you&apos;ve done</p>
        {milestones.map((m) => (
          <div key={m.label} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${m.done ? "bg-[#D4AF37]" : "bg-gray-200"}`}>
              {m.done && <Check className="w-3 h-3 text-white" />}
            </div>
            <p className={`text-sm font-medium ${m.done ? "text-gray-800" : "text-gray-400"}`}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* What's next preview */}
      <div className="text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Up next on your dashboard</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {["Open a bank account", "Get a business credit card", "Set up accounting", "Build a website"].map(item => (
            <div key={item} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
              <span className="text-gray-300">→</span>
              <span className="font-medium text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold py-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-[#D4AF37]/20"
      >
        Set up the rest of my business <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
