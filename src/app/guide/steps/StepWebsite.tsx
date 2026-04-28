"use client";

import { ArrowRight, ExternalLink } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const BUILDERS = [
  {
    name: "Carrd",
    price: "Free – $19/yr",
    desc: "Perfect for a simple one-pager. Easiest and fastest to launch.",
    url: "https://carrd.co",
  },
  {
    name: "Framer",
    price: "From $10/mo",
    desc: "Modern, design-forward. Beautiful results without coding.",
    url: "https://www.framer.com",
  },
  {
    name: "Squarespace",
    price: "From $16/mo",
    desc: "All-in-one — website, blog, and store in one place.",
    url: "https://www.squarespace.com",
  },
  {
    name: "Webflow",
    price: "From $14/mo",
    desc: "Most powerful — full design control, no code required.",
    url: "https://webflow.com",
  },
  {
    name: "Wix",
    price: "From $17/mo",
    desc: "Drag-and-drop, beginner-friendly with lots of templates.",
    url: "https://www.wix.com",
  },
];

export default function StepWebsite({ onComplete }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        You don&apos;t need a perfect website to start — a simple one-pager that tells people what you do and how to reach you is enough for day one.
      </p>

      <div className="space-y-2">
        {BUILDERS.map((b) => (
          <a
            key={b.name}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3.5 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                <span className="text-xs text-gray-400">{b.price}</span>
              </div>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 shrink-0 transition-colors" />
          </a>
        ))}
      </div>

      <div className="space-y-3 pt-1">
        <button
          onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          I have a website <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onComplete}
          className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors"
        >
          Skip this step →
        </button>
      </div>
    </div>
  );
}
