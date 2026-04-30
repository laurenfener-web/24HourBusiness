"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { STATE_FILING_DATA } from "@/lib/state-data";

interface Props {
  onComplete: (data: { state: string }) => void;
}

const FOCUS_STATES = ["California", "New York", "Florida", "Texas"];

export default function StepSelectState({ onComplete }: Props) {
  const [selected, setSelected] = useState("");
  const info = selected ? STATE_FILING_DATA[selected] : null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Where do you live?
      </p>

      <div className="space-y-2">
        {FOCUS_STATES.map((name) => {
          const isSelected = selected === name;
          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`w-full text-left rounded-xl border-2 px-5 py-4 transition-all flex items-center justify-between ${
                isSelected
                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <p className={`font-semibold text-base transition-colors ${isSelected ? "text-[#D4AF37]" : "text-gray-900"}`}>
                {name}
              </p>
              <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? "bg-[#D4AF37] border-[#D4AF37]" : "border-gray-200"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {selected && info && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Filing fee</p>
              <p className="text-2xl font-bold text-gray-900">{info.fee}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Processing time</p>
              <p className="text-2xl font-bold text-gray-900">{info.time}</p>
            </div>
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
