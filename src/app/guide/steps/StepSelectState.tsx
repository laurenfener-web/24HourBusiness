"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface Props {
  onComplete: (data: { state: string }) => void;
}

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export default function StepSelectState({ onComplete }: Props) {
  const [state, setState] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        Select the state where you live or primarily do business. This determines your filing requirements, fees, and timelines — they vary a lot by state.
      </p>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Which state are you in?
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
        >
          <option value="">Select your state...</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Not sure which state?</strong> Pick where you actually live and work — not necessarily where filing is cheapest. Operating in a state you didn&apos;t register in usually requires registering there anyway.
      </div>

      <button
        onClick={() => onComplete({ state })}
        disabled={!state}
        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        Continue with {state || "…"} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
