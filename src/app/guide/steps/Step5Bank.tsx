"use client";

import { ExternalLink, ArrowRight, AlertCircle } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const BANKS = [
  {
    name: "Mercury",
    tag: "Best for startups",
    description: "Built specifically for startups. No fees, no minimums, and deep integrations with Stripe, QuickBooks, and Gusto. FDIC insured via partner banks.",
    url: "https://mercury.com",
    features: ["No monthly fees", "No minimum balance", "Instant virtual debit cards", "API access"],
    recommended: true,
  },
  {
    name: "Relay",
    tag: "Best for budgeting",
    description: "Create up to 20 checking accounts to separate your revenue, operating costs, taxes, and savings. Brilliant for cash flow clarity.",
    url: "https://relayfi.com",
    features: ["20 sub-accounts", "No monthly fees", "Built-in budgeting", "Great for solo founders"],
    recommended: false,
  },
  {
    name: "Chase Business",
    tag: "Best with physical branches",
    description: "The largest US bank. Useful if you handle cash, need in-person banking, or want to pair with Chase business credit cards.",
    url: "https://www.chase.com/business/banking",
    features: ["4,700+ branches nationwide", "Pairs with Chase cards", "Cash deposits accepted"],
    recommended: false,
  },
];

export default function Step5Bank({ onComplete }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">
          <strong>Non-negotiable:</strong> Never mix business and personal money. Open a dedicated account before you receive a single dollar — commingling funds can pierce your LLC&apos;s liability protection.
        </p>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">
        You&apos;ll need your LLC formation documents and EIN ready. Most online banks approve you within 1–2 business days.
      </p>

      <div className="space-y-3">
        {BANKS.map((bank) => (
          <div
            key={bank.name}
            className={`border rounded-xl p-5 ${bank.recommended ? "border-[#D4AF37]/40 bg-[#D4AF37]/10" : "border-gray-100 bg-gray-50"}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-base">{bank.name}</span>
                  {bank.recommended && (
                    <span className="text-xs font-semibold bg-[#D4AF37] text-white px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{bank.tag}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{bank.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {bank.features.map((f) => (
                <span key={f} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
            <button
              onClick={() => { window.open(bank.url, "_blank", "noopener,noreferrer"); onComplete(); }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4AF37] hover:text-[#B8962E] transition-colors"
            >
              Open with {bank.name} <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        I already have a business account → Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
