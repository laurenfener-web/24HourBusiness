"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { STATE_FILING_DATA } from "@/lib/state-data";

interface Props {
  onComplete: (data: { state: string }) => void;
}

const STATES: { name: string; viewBox: string; path: string }[] = [
  {
    name: "California",
    viewBox: "0 0 68 110",
    path: "M 18,4 L 56,4 L 60,10 L 63,22 L 65,36 L 65,52 L 62,66 L 55,79 L 44,90 L 28,98 L 14,93 L 5,80 L 3,66 L 4,52 L 7,38 L 12,24 L 18,13 Z",
  },
  {
    name: "New York",
    viewBox: "0 0 106 82",
    path: "M 7,36 L 30,8 L 76,6 L 96,20 L 94,36 L 88,50 L 84,60 L 80,66 L 94,70 L 104,74 L 96,80 L 76,80 L 58,76 L 40,78 L 24,82 L 11,72 L 4,56 L 5,44 Z",
  },
  {
    name: "Florida",
    viewBox: "0 0 96 96",
    path: "M 4,16 L 90,5 L 91,28 L 88,46 L 84,62 L 78,74 L 68,83 L 56,90 L 42,88 L 32,78 L 22,64 L 13,50 L 5,36 Z",
  },
  {
    name: "Texas",
    viewBox: "0 0 106 96",
    path: "M 7,7 L 48,7 L 48,27 L 98,27 L 98,58 L 88,74 L 68,86 L 46,88 L 28,82 L 12,67 L 5,47 L 5,27 Z",
  },
];

export default function StepSelectState({ onComplete }: Props) {
  const [selected, setSelected] = useState("");
  const info = selected ? STATE_FILING_DATA[selected] : null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">Where do you live?</p>

      <div className="grid grid-cols-2 gap-3">
        {STATES.map(({ name, viewBox, path }) => {
          const isSelected = selected === name;
          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`flex flex-col items-center justify-end gap-3 pt-5 pb-4 px-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="h-16 w-full flex items-end justify-center">
                <svg
                  viewBox={viewBox}
                  className={`max-h-full max-w-full transition-colors ${
                    isSelected ? "text-indigo-500" : "text-gray-300"
                  }`}
                  style={{ maxHeight: "64px" }}
                >
                  <path d={path} fill="currentColor" />
                </svg>
              </div>
              <span className={`text-sm font-semibold transition-colors ${
                isSelected ? "text-indigo-700" : "text-gray-700"
              }`}>
                {name}
              </span>
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
