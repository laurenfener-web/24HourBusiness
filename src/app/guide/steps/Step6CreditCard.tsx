"use client";

import { ExternalLink, ArrowRight, Lightbulb } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const CARDS = [
  {
    name: "Chase Ink Business Cash",
    tag: "Best overall for new businesses",
    description: "5% cash back on office supplies and internet. $750 sign-up bonus. No annual fee. The safest first card for most founders.",
    url: "https://creditcards.chase.com/business-credit-cards/ink/cash",
    features: ["No annual fee", "5% on office & internet", "$750 sign-up bonus", "Requires personal credit check"],
    recommended: true,
  },
  {
    name: "Amex Blue Business Cash",
    tag: "Best for simplicity",
    description: "2% cash back on all purchases, no category tracking needed. No annual fee. Simple and dependable.",
    url: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-blue-business-cash-credit-card/",
    features: ["No annual fee", "2% on everything", "$250 statement credit offer"],
    recommended: false,
  },
  {
    name: "Brex",
    tag: "Best if you have no personal credit history",
    description: "No personal guarantee required. Built for startups. Higher limits from day one. Requires business revenue or funding.",
    url: "https://www.brex.com",
    features: ["No personal guarantee", "High credit limits", "Premium rewards", "Requires business activity"],
    recommended: false,
  },
];

export default function Step6CreditCard({ onComplete }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        A dedicated business credit card does two things: it keeps your expenses completely separate, and it starts building your business credit history from day one. Use it for everything business-related.
      </p>

      <div className="space-y-3">
        {CARDS.map((card) => (
          <div
            key={card.name}
            className={`border rounded-xl p-5 ${card.recommended ? "border-indigo-200 bg-indigo-50" : "border-gray-100 bg-gray-50"}`}
          >
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-900">{card.name}</span>
              {card.recommended && (
                <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">{card.tag}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{card.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {card.features.map((f) => (
                <span key={f} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Apply now <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Golden rule:</strong> Pay the full balance every month. This builds strong credit and costs you nothing in interest.
        </p>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        I applied for a card <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
