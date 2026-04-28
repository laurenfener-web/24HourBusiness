"use client";

import { useState } from "react";

interface Props {
  onComplete: (data: { structure: string }) => void;
}

const OPTIONS = [
  {
    id: "llc",
    label: "LLC",
    subtitle: "Limited Liability Company",
    best: "Most founders",
    pros: ["Protects personal assets", "Simple to run", "Flexible taxes", "Low cost"],
    cons: ["Annual fees vary by state"],
    recommended: true,
  },
  {
    id: "sole",
    label: "Sole Proprietorship",
    subtitle: "Just you, no registration",
    best: "Freelancers testing an idea",
    pros: ["Zero setup cost", "No paperwork"],
    cons: ["No liability protection", "Harder to get funding", "Personal assets at risk"],
    recommended: false,
  },
  {
    id: "scorp",
    label: "S-Corp",
    subtitle: "Tax savings at higher income",
    best: "Established businesses $80k+ profit",
    pros: ["Big tax savings on self-employment tax", "Legitimate business structure"],
    cons: ["More complex", "Payroll required", "More expensive to run"],
    recommended: false,
  },
  {
    id: "ccorp",
    label: "C-Corp",
    subtitle: "For venture-backed startups",
    best: "Raising VC money",
    pros: ["Investors expect it", "Equity is easy to issue", "Delaware-friendly"],
    cons: ["Double taxation", "Most complex", "Expensive"],
    recommended: false,
  },
];

export default function Step2Structure({ onComplete }: Props) {
  const [selected, setSelected] = useState("llc");

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        For most first-time founders, an <strong className="text-gray-900">LLC</strong> is the right move — it protects your personal assets and is simple to run.
      </p>

      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setSelected(opt.id)}
          className={`w-full text-left border rounded-xl p-5 transition-all ${
            selected === opt.id
              ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
              : "border-gray-200 bg-white hover:border-indigo-300"
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">{opt.label}</span>
                {opt.recommended && (
                  <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{opt.subtitle}</p>
              <p className="text-xs text-gray-400 mt-1">Best for: {opt.best}</p>
            </div>
            {selected === opt.id && (
              <span className="shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex gap-6 text-xs">
            <div>
              <p className="font-semibold text-green-700 mb-1">Pros</p>
              <ul className="space-y-0.5">
                {opt.pros.map((p) => <li key={p} className="text-gray-600">+ {p}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-red-500 mb-1">Cons</p>
              <ul className="space-y-0.5">
                {opt.cons.map((c) => <li key={c} className="text-gray-600">– {c}</li>)}
              </ul>
            </div>
          </div>
        </button>
      ))}

      <button
        onClick={() => onComplete({ structure: selected })}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition-colors text-lg mt-4"
      >
        Go with {OPTIONS.find((o) => o.id === selected)?.label} →
      </button>
    </div>
  );
}
