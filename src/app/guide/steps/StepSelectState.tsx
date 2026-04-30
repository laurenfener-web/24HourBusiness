"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { STATE_FILING_DATA } from "@/lib/state-data";

interface Props {
  onComplete: (data: { state: string }) => void;
}

const FOCUS_STATES = [
  {
    name: "California",
    abbr: "CA",
    note: "$800/yr minimum franchise tax — owed even if you earn nothing",
    noteType: "warning" as const,
  },
  {
    name: "New York",
    abbr: "NY",
    note: "Publication required after filing — we'll show you how to do it for under $100",
    noteType: "warning" as const,
  },
  {
    name: "Florida",
    abbr: "FL",
    note: "No state income tax. No publication requirement. Same-day processing.",
    noteType: "positive" as const,
  },
  {
    name: "Texas",
    abbr: "TX",
    note: "No state income tax. Franchise tax only kicks in above $2.47M revenue.",
    noteType: "positive" as const,
  },
];

export default function StepSelectState({ onComplete }: Props) {
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Where do you live? Your state determines your filing steps, fees, and timeline.
      </p>

      <div className="space-y-2">
        {FOCUS_STATES.map(({ name, abbr, note, noteType }) => {
          const info = STATE_FILING_DATA[name];
          const isSelected = selected === name;

          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md shrink-0 tracking-wide ${
                    isSelected ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {abbr}
                  </span>
                  <div className="min-w-0">
                    <p className={`font-bold text-lg leading-tight ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                      {name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{info.fee} filing fee</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-sm text-gray-500">{info.time}</span>
                    </div>
                  </div>
                </div>
                <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${
                  isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-200"
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <p className={`text-xs mt-3 leading-relaxed ${
                noteType === "warning" ? "text-amber-700" : "text-emerald-700"
              }`}>
                {note}
              </p>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onComplete({ state: selected })}
        disabled={!selected}
        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {selected ? `Continue with ${selected}` : "Select your state"} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
