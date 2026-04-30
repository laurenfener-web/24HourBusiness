"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { STATE_FILING_DATA } from "@/lib/state-data";

interface Props {
  onComplete: (data: { state: string }) => void;
}

const FOCUS_STATES = [
  { name: "California", abbr: "CA" },
  { name: "New York",   abbr: "NY" },
  { name: "Florida",    abbr: "FL" },
  { name: "Texas",      abbr: "TX" },
];

export default function StepSelectState({ onComplete }: Props) {
  const [selected, setSelected] = useState("");
  const info = selected ? STATE_FILING_DATA[selected] : null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Where do you live?
      </p>

      <div className="space-y-2">
        {FOCUS_STATES.map(({ name, abbr }) => {
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md shrink-0 tracking-wide transition-colors ${
                    isSelected ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {abbr}
                  </span>
                  <p className={`font-bold text-lg transition-colors ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                    {name}
                  </p>
                </div>
                <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-200"
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && info && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">State filing fee</p>
            <p className="text-2xl font-bold text-gray-900">{info.fee}</p>
          </div>
          <button
            onClick={() => onComplete({ state: selected })}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
