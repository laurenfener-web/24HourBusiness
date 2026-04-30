"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface Props {
  onComplete: (data: { state: string }) => void;
}

const FOCUS_STATES = [
  { name: "California", emoji: "☀️" },
  { name: "New York",   emoji: "🗽" },
  { name: "Florida",    emoji: "🌴" },
  { name: "Texas",      emoji: "⭐" },
];

export default function StepSelectState({ onComplete }: Props) {
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        Where do you live? Your state determines your filing steps, fees, and timeline — we&apos;ll customize the rest of the guide for you.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {FOCUS_STATES.map(({ name, emoji }) => {
          const isSelected = selected === name;
          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-4xl leading-none">{emoji}</span>
              <span className={`font-bold text-base ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                {name}
              </span>
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
