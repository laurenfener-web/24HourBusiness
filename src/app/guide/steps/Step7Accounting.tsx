"use client";

import { ExternalLink, ArrowRight, Check } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const OPTIONS = [
  {
    name: "Wave",
    tag: "Free forever",
    description: "Completely free invoicing and accounting. Perfect if you're just getting started and want to keep costs at zero.",
    url: "https://www.waveapps.com",
    features: ["100% free", "Invoicing", "Expense tracking", "Basic reports"],
    recommended: false,
  },
  {
    name: "QuickBooks",
    tag: "Industry standard",
    description: "The most widely used accounting software — your accountant will know it cold. From $30/month. Worth it when revenue starts flowing.",
    url: "https://quickbooks.intuit.com",
    features: ["$30–90/month", "Connects to everything", "Tax-ready reports", "Payroll add-on available"],
    recommended: true,
  },
  {
    name: "Bench",
    tag: "Done-for-you bookkeeping",
    description: "A real human bookkeeper handles your books each month. Completely hands-off. Best for founders who want to never think about this.",
    url: "https://bench.co",
    features: ["Real bookkeeper", "From $299/month", "Tax filing included", "Catch-up available"],
    recommended: false,
  },
];

const HABITS = [
  "Connect your business bank account and credit card on day one",
  "Categorize every transaction the week it happens — don't let it pile up",
  "Set aside 25–30% of every payment received for taxes",
  "Do a 15-minute P&L review at the end of every month",
];

export default function Step7Accounting({ onComplete }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        Set this up now — before you make your first dollar. Good bookkeeping habits from the start save you thousands at tax time and give you a real picture of your business health.
      </p>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <div
            key={opt.name}
            className={`border rounded-xl p-5 ${opt.recommended ? "border-[#FF8C42]/40 bg-[#FF8C42]/10" : "border-gray-100 bg-gray-50"}`}
          >
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-900">{opt.name}</span>
              {opt.recommended && (
                <span className="text-xs font-semibold bg-[#FF8C42] text-white px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">{opt.tag}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{opt.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {opt.features.map((f) => (
                <span key={f} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
            <button
              onClick={() => { window.open(opt.url, "_blank", "noopener,noreferrer"); onComplete(); }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF8C42] hover:text-[#E87030] transition-colors"
            >
              Get started with {opt.name} <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">4 habits to start immediately</p>
        <ul className="space-y-2.5">
          {HABITS.map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        I&apos;m already set up → Continue <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={onComplete}
        className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors"
      >
        Skip this step →
      </button>
    </div>
  );
}
