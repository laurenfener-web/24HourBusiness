"use client";

import { ArrowRight, ExternalLink } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: () => void;
}

const ACTIONS = [
  { emoji: "📣", title: "Tell 10 people", desc: "Text, email, or call — let your network know what you're building." },
  { emoji: "💼", title: "Post on LinkedIn", desc: "Your professional network is your first warm audience. Be specific about what you do." },
  { emoji: "📧", title: "Reach out to 3 potential customers", desc: "Don't broadcast — go direct. A personal message beats a post every time." },
  { emoji: "💳", title: "Set up payment processing", desc: "Stripe, Square, or Venmo Business — make it easy to pay you before you need it." },
  { emoji: "🌐", title: "Build a simple website", desc: "Carrd.co lets you launch a clean, professional page in under an hour." },
  { emoji: "🎯", title: "Set a 30-day revenue goal", desc: "What does success look like this month? Write it down. Make it specific." },
];

export default function Step8Launch({ businessName, onComplete }: Props) {
  return (
    <div className="space-y-7">
      <div className="text-center py-6 border-b border-gray-100">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {businessName ? `${businessName} is officially open for business.` : "You're officially open for business."}
        </h2>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
          The hard part is done. Most people never get past the &ldquo;thinking about it&rdquo; stage. You&apos;re already lapping them.
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-4">Your launch checklist</p>
        <ul className="space-y-3">
          {ACTIONS.map((a, i) => (
            <li key={i} className="flex items-start gap-4 bg-gray-50 rounded-xl px-4 py-4 border border-gray-100">
              <span className="text-2xl shrink-0 leading-none mt-0.5">{a.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{a.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
        >
          Stripe <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://carrd.co"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
        >
          Carrd.co <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-500/20"
      >
        I&apos;m launched. Let&apos;s go. <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
