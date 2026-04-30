"use client";

import { ArrowRight, ExternalLink, Globe } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: () => void;
}

function toDomain(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
}

const REGISTRARS = [
  {
    name: "Cloudflare",
    desc: "At-cost pricing — no markup ever, free privacy protection, and excellent DNS management.",
    getUrl: () => "https://www.cloudflare.com/products/registrar/",
    recommended: true,
  },
  {
    name: "Namecheap",
    desc: "Usually the cheapest — ~$9/yr for .com",
    getUrl: (d: string) => `https://www.namecheap.com/domains/registration/results/?domain=${d}`,
  },
  {
    name: "Squarespace Domains",
    desc: "Good if you're using Squarespace for your site",
    getUrl: () => "https://domains.squarespace.com/",
  },
  {
    name: "GoDaddy",
    desc: "Largest registrar — watch for renewal price hikes",
    getUrl: (d: string) => `https://www.godaddy.com/domainsearch/find?domainToCheck=${d}`,
  },
];

export default function StepDomain({ businessName, onComplete }: Props) {
  const suggested = businessName ? toDomain(businessName) : "yourbusiness.com";

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        A custom domain makes your business look professional and takes about 5 minutes to buy. Most .com domains cost $9–12/year.
      </p>

      {businessName && (
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-4 py-4 flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#B8962E] uppercase tracking-wide mb-0.5">Suggested domain</p>
            <p className="font-bold text-[#D4AF37] text-lg">{suggested}</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Where to buy</p>
        <div className="space-y-2">
          {REGISTRARS.map((r) => (
            <a
              key={r.name}
              href={r.getUrl(suggested)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-colors group ${
                r.recommended ? "border-[#D4AF37]/40 bg-[#D4AF37]/5" : "border-gray-100"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  {r.recommended && (
                    <span className="text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{r.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#D4AF37] shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <button
          onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          I bought my domain <ArrowRight className="w-4 h-4" />
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
