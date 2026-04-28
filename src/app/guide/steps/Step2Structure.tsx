"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

interface Props {
  onComplete: (data: { structure: string }) => void;
}

const OPTIONS = [
  {
    id: "llc",
    label: "LLC",
    subtitle: "Limited Liability Company",
    best: "Most founders",
    description: "The go-to choice for most first-time founders. You get personal liability protection without the complexity of a corporation.",
    pros: ["Protects personal assets", "Simple to run", "Flexible tax treatment", "Easy to maintain"],
    cons: ["Annual state fees apply"],
    recommended: true,
  },
  {
    id: "sole",
    label: "Sole Proprietorship",
    subtitle: "Just you, no registration",
    best: "Freelancers testing an idea",
    description: "No paperwork, no fees — but your personal assets are on the line if anything goes wrong.",
    pros: ["Zero setup cost", "No paperwork", "Simplest option"],
    cons: ["No liability protection", "Harder to get funding", "Personal assets at risk"],
    recommended: false,
  },
  {
    id: "scorp",
    label: "S-Corp",
    subtitle: "Tax savings at scale",
    best: "Profitable businesses ($80k+ per year)",
    description: "Once you're making real money, an S-Corp can save you thousands in self-employment taxes. Talk to an accountant first.",
    pros: ["Significant tax savings", "Credible business structure"],
    cons: ["Requires payroll", "More complex to manage", "Annual maintenance costs"],
    recommended: false,
  },
  {
    id: "ccorp",
    label: "C-Corp",
    subtitle: "Built for venture funding",
    best: "Raising VC money",
    description: "If you plan to raise institutional money, investors will expect a Delaware C-Corp. Otherwise, it's overkill.",
    pros: ["Investors expect it", "Easy to issue equity", "Delaware-friendly ecosystem"],
    cons: ["Double taxation", "Most complex to run", "Expensive to maintain"],
    recommended: false,
  },
];

export default function Step2Structure({ onComplete }: Props) {
  const [selected, setSelected] = useState("llc");
  const current = OPTIONS.find((o) => o.id === selected)!;

  return (
    <div className="space-y-5">
      <p className="text-gray-500 text-sm leading-relaxed">
        For most first-time founders, an <strong className="text-gray-900 font-semibold">LLC</strong> is the right move — it protects your personal assets and is simple to run. Here&apos;s how the options compare.
      </p>

      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left border rounded-xl p-5 transition-all ${
              selected === opt.id
                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  selected === opt.id ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
                }`}>
                  {selected === opt.id && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{opt.label}</span>
                    <span className="text-gray-400 text-sm">— {opt.subtitle}</span>
                    {opt.recommended && (
                      <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Best for: {opt.best}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail card for selected option */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div>
          <p className="font-semibold text-gray-900 mb-1">{current.label} — what to know</p>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-emerald-700 mb-2">Pros</p>
            <ul className="space-y-1.5">
              {current.pros.map((p) => (
                <li key={p} className="flex items-start gap-2 text-gray-600">
                  <span className="text-emerald-500 mt-0.5">+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-500 mb-2">Cons</p>
            <ul className="space-y-1.5">
              {current.cons.map((c) => (
                <li key={c} className="flex items-start gap-2 text-gray-600">
                  <span className="text-red-400 mt-0.5">–</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={() => onComplete({ structure: selected })}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        Go with {current.label} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
