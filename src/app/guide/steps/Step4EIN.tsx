"use client";

import { ExternalLink, ArrowRight, AlertCircle } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: () => void;
}

const ITEMS = [
  { label: "Your LLC name", value: (name: string) => name || "your business name" },
  { label: "State of formation", value: () => "your filing state" },
  { label: "Your personal SSN", value: () => "as the responsible party" },
  { label: "About 10 minutes", value: () => "the form is straightforward" },
];

export default function Step4EIN({ businessName, onComplete }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-emerald-600 text-base">$</span>
        </div>
        <div>
          <p className="font-semibold text-emerald-900 text-sm">100% free. Takes 10 minutes.</p>
          <p className="text-emerald-700 text-sm mt-0.5">The IRS gives you an EIN instantly online — no fees, no waiting, no third-party services needed.</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">What is an EIN?</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          An Employer Identification Number is your business&apos;s Social Security number. You need it to open a business bank account, file taxes, and hire people. Even solo founders with no employees need one.
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">What you&apos;ll need</p>
        <ul className="space-y-2.5">
          {ITEMS.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                <span className="text-sm text-gray-400"> — {item.value(businessName)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Save your confirmation PDF.</strong> The IRS shows your EIN at the end — download and store it permanently. Banks and accountants will ask for it repeatedly.
        </p>
      </div>

      <a
        href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
      >
        Apply for your EIN on IRS.gov
        <ExternalLink className="w-4 h-4" />
      </a>

      <button
        onClick={onComplete}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        I got my EIN <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
