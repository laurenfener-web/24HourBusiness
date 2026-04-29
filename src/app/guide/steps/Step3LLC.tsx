"use client";

import { ExternalLink, ArrowRight, DollarSign, Clock, AlertCircle } from "lucide-react";

interface Props {
  businessName: string;
  structure: string;
  onComplete: (data: { state: string }) => void;
}

const CA_LLC = {
  fee: "$70",
  time: "3–5 business days",
  url: "https://bizfileonline.sos.ca.gov",
};

export default function Step3LLC({ businessName, structure, onComplete }: Props) {
  if (structure === "sole") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          Good news — sole proprietors in California don&apos;t need to file anything with the state. You&apos;re automatically in business the moment you start.
        </p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <p className="font-semibold text-emerald-800 mb-1">No state filing required</p>
          <p className="text-sm text-emerald-700">In California, operating as a sole proprietor requires no formal registration.</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800">A few things you may still need:</p>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <span className="text-indigo-500 font-bold shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-semibold text-gray-800">Fictitious Business Name (FBN)</p>
                <p className="text-gray-500 mt-0.5">If your business name differs from your legal name, California requires filing a Fictitious Business Name with your county — usually $25–45.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <span className="text-indigo-500 font-bold shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-semibold text-gray-800">Local business license</p>
                <p className="text-gray-500 mt-0.5">Most California cities require a local business license regardless of structure — typically $50–100/year from your city or county clerk.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <span className="text-indigo-500 font-bold shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-semibold text-gray-800">Separate bank account</p>
                <p className="text-gray-500 mt-0.5">Even without an LLC, keeping business money separate from personal makes taxes much easier and looks more professional to clients.</p>
              </div>
            </li>
          </ul>
        </div>

        <button
          onClick={() => onComplete({ state: "California" })}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Got it — continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (structure === "ccorp") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          Most investors expect a Delaware C-Corp. You can incorporate in Delaware even if you operate entirely in California — just note that California will still require you to register as a foreign corporation (~$100/yr).
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            California charges an <strong>$800/year minimum franchise tax</strong> on all corporations doing business here — regardless of where you incorporated.
          </p>
        </div>

        <div className="space-y-2">
          <a
            href="https://stripe.com/atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-indigo-200 bg-indigo-50/50 rounded-xl px-4 py-3.5 hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-gray-900 text-sm">Stripe Atlas</p>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-gray-500">$500 flat — forms your Delaware C-Corp, gets your EIN, opens a Mercury bank account, and sets up your cap table.</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 shrink-0 transition-colors" />
          </a>
          <a
            href="https://icis.corp.delaware.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3.5 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">File directly in Delaware</p>
              <p className="text-xs text-gray-500">$90 fee, 1–3 day processing. You&apos;ll need a Delaware registered agent (~$50/yr).</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 shrink-0 transition-colors" />
          </a>
        </div>

        <button
          onClick={() => onComplete({ state: "California" })}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          I&apos;ve filed my C-Corp → Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // LLC and S-Corp: California filing
  const label = structure === "scorp" ? "S-Corp" : "LLC";

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        You&apos;ll file with the California Secretary of State online. It takes about 15 minutes and costs $70.
        {structure === "scorp" && " After your corporation is formed, you'll file IRS Form 2553 to elect S-Corp tax status."}
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          California charges an <strong>$800/year minimum franchise tax</strong> for all LLCs and corporations — due your first year and every year after.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
            <p className="font-bold text-gray-900 text-lg mt-0.5">{CA_LLC.fee}</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
            <p className="font-bold text-gray-900 text-lg mt-0.5">{CA_LLC.time}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">What you&apos;ll need</p>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            ["Your business name", businessName || "your chosen name"],
            ["Registered agent address", "can be your home address in California"],
            ["Names of all owners/members", "even if it's just you"],
            ["Credit or debit card", `for the $70 filing fee`],
          ].map(([lbl, detail]) => (
            <li key={lbl} className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
              <span><strong className="text-gray-800">{lbl}</strong> — {detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {structure === "scorp" && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800 space-y-1">
          <p className="font-semibold">Two steps for an S-Corp</p>
          <p>1. File as a corporation with California below.</p>
          <p>2. Then file <a href="https://www.irs.gov/forms-pubs/about-form-2553" target="_blank" rel="noopener noreferrer" className="underline font-medium">IRS Form 2553</a> to elect S-Corp tax status — free, must be filed within 75 days of forming.</p>
        </div>
      )}

      <button
        onClick={() => { window.open(CA_LLC.url, "_blank", "noopener,noreferrer"); onComplete({ state: "California" }); }}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
      >
        File your {label} in California
        <ExternalLink className="w-4 h-4" />
      </button>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center mb-4">
          Rather have someone handle it?{" "}
          <button
            onClick={() => { window.open("https://stripe.com/atlas", "_blank", "noopener,noreferrer"); onComplete({ state: "California" }); }}
            className="text-indigo-500 hover:text-indigo-600 underline"
          >
            Stripe Atlas
          </button>{" "}
          does the whole thing for $500.
        </p>
        <button
          onClick={() => onComplete({ state: "California" })}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          I already filed → Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
