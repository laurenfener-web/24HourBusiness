"use client";

import { Check } from "lucide-react";
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
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Where do you live? Your state determines your filing steps, fees, and timeline.
      </p>

      <div className="space-y-2">
        {FOCUS_STATES.map(({ name, abbr, note, noteType }) => {
          const info = STATE_FILING_DATA[name];

          return (
            <button
              key={name}
              onClick={() => onComplete({ state: name })}
              className="w-full text-left rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-400 hover:bg-indigo-50 p-5 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold font-mono px-2 py-1 rounded-md shrink-0 tracking-wide bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                    {abbr}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-lg leading-tight text-gray-900 group-hover:text-indigo-900 transition-colors">
                      {name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{info.fee} filing fee</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-sm text-gray-500">{info.time}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-indigo-600 group-hover:bg-indigo-600 flex items-center justify-center transition-colors mt-0.5">
                  <Check className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
    </div>
  );
}
