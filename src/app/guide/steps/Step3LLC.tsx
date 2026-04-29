"use client";

import { ExternalLink, ArrowRight, DollarSign, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { FILING_SUBSTEPS } from "../GuideClient";

interface Props {
  businessName: string;
  structure: string;
  state: string;
  subStep: number;
  onSubStepChange: (n: number) => void;
  onComplete: () => void;
}

interface StateInfo {
  fee: string;
  time: string;
  url: string;
  notes?: string;
}

const STATES: Record<string, StateInfo> = {
  "Alabama":        { fee: "$200", time: "1–2 weeks",    url: "https://www.sos.alabama.gov/business-entities/llc" },
  "Alaska":         { fee: "$250", time: "10–15 days",   url: "https://www.commerce.alaska.gov/web/cbpl/BusinessLicensing.aspx" },
  "Arizona":        { fee: "$50",  time: "14–16 days",   url: "https://ecorp.azcc.gov" },
  "Arkansas":       { fee: "$45",  time: "3–5 days",     url: "https://www.sos.arkansas.gov/business-commercial-services-bcs" },
  "California":     { fee: "$70",  time: "3–5 days",     url: "https://bizfileonline.sos.ca.gov" },
  "Colorado":       { fee: "$50",  time: "Same day",     url: "https://www.sos.state.co.us/biz" },
  "Connecticut":    { fee: "$120", time: "3–5 days",     url: "https://www.concord-sots.ct.gov" },
  "Delaware":       { fee: "$90",  time: "1–3 days",     url: "https://icis.corp.delaware.gov", notes: "Delaware is investor-preferred but has an annual franchise tax. Great for C-Corps, less necessary for most small LLCs." },
  "Florida":        { fee: "$125", time: "Same day",     url: "https://dos.myflorida.com/sunbiz" },
  "Georgia":        { fee: "$100", time: "7 days",       url: "https://ecorp.sos.ga.gov" },
  "Hawaii":         { fee: "$50",  time: "3–5 days",     url: "https://cca.hawaii.gov/breg" },
  "Idaho":          { fee: "$100", time: "Same day",     url: "https://sosbiz.idaho.gov" },
  "Illinois":       { fee: "$150", time: "10 days",      url: "https://www.ilsos.gov/departments/business_services" },
  "Indiana":        { fee: "$95",  time: "1 day",        url: "https://inbiz.in.gov" },
  "Iowa":           { fee: "$50",  time: "5 days",       url: "https://sos.iowa.gov/business/FormsAndFees.html" },
  "Kansas":         { fee: "$160", time: "3–5 days",     url: "https://www.kssos.org/business/business.html" },
  "Kentucky":       { fee: "$40",  time: "3–5 days",     url: "https://sos.ky.gov/bus/business-filings" },
  "Louisiana":      { fee: "$100", time: "Same day",     url: "https://www.geauxbiz.com" },
  "Maine":          { fee: "$175", time: "1–2 weeks",    url: "https://www.maine.gov/sos/cec/corp" },
  "Maryland":       { fee: "$100", time: "4–6 weeks",    url: "https://egov.maryland.gov/businessexpress" },
  "Massachusetts":  { fee: "$500", time: "Same day",     url: "https://corp.sec.state.ma.us", notes: "Massachusetts has one of the highest LLC filing fees in the country at $500." },
  "Michigan":       { fee: "$50",  time: "10 days",      url: "https://www.michigan.gov/lara" },
  "Minnesota":      { fee: "$155", time: "3–5 days",     url: "https://mblsportal.sos.state.mn.us" },
  "Mississippi":    { fee: "$50",  time: "1–2 weeks",    url: "https://www.sos.ms.gov/Business-Services/Pages/default.aspx" },
  "Missouri":       { fee: "$50",  time: "3–5 days",     url: "https://bsd.sos.mo.gov/" },
  "Montana":        { fee: "$35",  time: "3–5 days",     url: "https://sosmt.gov/business" },
  "Nebraska":       { fee: "$100", time: "2–3 weeks",    url: "https://www.sos.ne.gov/business/corp_serv" },
  "Nevada":         { fee: "$425", time: "Same day",     url: "https://esos.nv.gov", notes: "Nevada has no state income tax and strong privacy protections, but the initial filing fee is high." },
  "New Hampshire":  { fee: "$100", time: "5 days",       url: "https://www.sos.nh.gov/corporate-division" },
  "New Jersey":     { fee: "$125", time: "Same day",     url: "https://www.njportal.com/DOR/BusinessFormation" },
  "New Mexico":     { fee: "$50",  time: "Same day",     url: "https://www.sos.nm.gov/business-services" },
  "New York":       { fee: "$200", time: "2–3 weeks",    url: "https://www.dos.ny.gov/corps" },
  "North Carolina": { fee: "$125", time: "Same day",     url: "https://www.sosnc.gov/divisions/business_registration" },
  "North Dakota":   { fee: "$135", time: "2–5 days",     url: "https://sos.nd.gov/business/business-services.html" },
  "Ohio":           { fee: "$99",  time: "Same day",     url: "https://bsportal.ohiosos.gov/" },
  "Oklahoma":       { fee: "$100", time: "3–5 days",     url: "https://www.sos.ok.gov/business" },
  "Oregon":         { fee: "$100", time: "Same day",     url: "https://sos.oregon.gov/business" },
  "Pennsylvania":   { fee: "$125", time: "1–2 weeks",    url: "https://www.corporations.pa.gov" },
  "Rhode Island":   { fee: "$150", time: "Same day",     url: "https://www.sos.ri.gov/divisions/Business-Portal" },
  "South Carolina": { fee: "$110", time: "Same day",     url: "https://businessfilings.sc.gov" },
  "South Dakota":   { fee: "$150", time: "Same day",     url: "https://sdsos.gov/business-services" },
  "Tennessee":      { fee: "$300", time: "3–5 days",     url: "https://sos.tn.gov/business" },
  "Texas":          { fee: "$300", time: "Same day",     url: "https://www.sos.state.tx.us/corp/index.shtml" },
  "Utah":           { fee: "$54",  time: "Same day",     url: "https://secure.utah.gov/bes" },
  "Vermont":        { fee: "$125", time: "3–5 days",     url: "https://bizfilings.vermont.gov" },
  "Virginia":       { fee: "$100", time: "Same day",     url: "https://cis.scc.virginia.gov" },
  "Washington":     { fee: "$200", time: "2–3 days",     url: "https://www.sos.wa.gov/corporations-charities" },
  "West Virginia":  { fee: "$100", time: "Same day",     url: "https://apps.wv.gov/SOS/BusinessEntitySearch" },
  "Wisconsin":      { fee: "$130", time: "Same day",     url: "https://www.wdfi.org/corporations" },
  "Wyoming":        { fee: "$100", time: "Same day",     url: "https://wyobiz.wyo.gov", notes: "Wyoming has no state income tax and strong asset protection laws — popular for holding companies." },
};

// Per-state, per-sub-step content
function SubStepContent({
  state,
  subStepIndex,
  businessName,
  onNext,
  onSkip,
  isLast,
}: {
  state: string;
  subStepIndex: number;
  businessName: string;
  onNext: () => void;
  onSkip?: () => void;
  isLast: boolean;
}) {
  const info = STATES[state];
  const nextLabel = isLast ? "All done → Continue" : "Done → Next step";

  if (state === "California") {
    if (subStepIndex === 0) {
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            Before filing, confirm your business name is available in California. This is optional but only takes a minute and prevents a rejected filing.
          </p>
          <a
            href={`https://bizfileonline.sos.ca.gov/search/business`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
          >
            Search CA business names <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
            Name is available → Continue <ArrowRight className="w-4 h-4" />
          </button>
          {onSkip && (
            <button onClick={onSkip} className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-1 transition-colors">
              Skip — I already checked →
            </button>
          )}
        </div>
      );
    }
    if (subStepIndex === 1) {
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            File your Articles of Organization online with the California Secretary of State. This is the official document that creates your LLC.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">$70</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">3–5 days</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">What you&apos;ll need</p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {[
                ["Business name", businessName || "your chosen name"],
                ["Registered agent", "can be your California home address"],
                ["Member names", "everyone who owns the LLC"],
                ["Credit card", "for the $70 filing fee"],
              ].map(([l, d]) => (
                <li key={l} className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  <span><strong className="text-gray-800">{l}</strong> — {d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">California charges an <strong>$800/year minimum franchise tax</strong> starting your first year.</p>
          </div>
          <button onClick={() => { window.open("https://bizfileonline.sos.ca.gov", "_blank", "noopener,noreferrer"); onNext(); }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
            File on bizfileonline.sos.ca.gov <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
            I already filed → Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
    if (subStepIndex === 2) {
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            California requires you to file a Statement of Information within <strong className="text-gray-700">90 days</strong> of forming your LLC. It&apos;s a short form confirming your address and members.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">$20</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Deadline</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">90 days</p>
              </div>
            </div>
          </div>
          <button onClick={() => { window.open("https://bizfileonline.sos.ca.gov", "_blank", "noopener,noreferrer"); onNext(); }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
            File Statement of Information <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
            {nextLabel} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
  }

  if (state === "New York") {
    if (subStepIndex === 0) {
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            File your Articles of Organization with the New York Department of State to officially create your LLC.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">$200</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">2–3 weeks</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Heads up:</strong> New York also has a publication requirement after this — plan for an additional $1,000–2,000. See the next step.
            </p>
          </div>
          <button onClick={() => { window.open("https://www.dos.ny.gov/corps", "_blank", "noopener,noreferrer"); onNext(); }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
            File on dos.ny.gov/corps <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
            I already filed → Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
    if (subStepIndex === 1) {
      return (
        <div className="space-y-5">
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <p className="font-semibold text-red-800 mb-1">New York&apos;s publication requirement</p>
            <p className="text-sm text-red-700 leading-relaxed">
              Within 120 days of forming your LLC, New York law requires you to publish a notice in <strong>two newspapers</strong> in your county for 6 consecutive weeks. This typically costs <strong>$1,000–2,000+</strong> depending on your county.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">How to do it:</p>
            <ol className="space-y-1.5 list-decimal list-inside">
              <li>Contact your county clerk to get the list of approved newspapers</li>
              <li>Contact each newspaper to place the notice (~$500–1,000 each)</li>
              <li>After 6 weeks, each paper gives you an Affidavit of Publication</li>
              <li>Use those to file the Certificate of Publication (next step)</li>
            </ol>
          </div>
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
            I understand, I&apos;ve published → Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
    if (subStepIndex === 2) {
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            After your 6-week publication period ends, file the Certificate of Publication with New York to complete your LLC formation.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">$50</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Deadline</p>
                <p className="font-bold text-gray-900 text-lg mt-0.5">120 days</p>
              </div>
            </div>
          </div>
          <button onClick={() => { window.open("https://www.dos.ny.gov/corps", "_blank", "noopener,noreferrer"); onNext(); }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
            File Certificate of Publication <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
            {nextLabel} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
  }

  if (state === "Florida") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          File your Articles of Organization online with the Florida Division of Corporations (Sunbiz). Florida processes same-day — one of the fastest in the country.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
              <p className="font-bold text-gray-900 text-lg mt-0.5">$125</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
              <p className="font-bold text-gray-900 text-lg mt-0.5">Same day</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">What you&apos;ll need</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {[
              ["Business name", businessName || "your chosen name"],
              ["Registered agent", "Florida address required (can be yours)"],
              ["Member names", "everyone who owns the LLC"],
              ["Credit card", "for the $125 filing fee"],
            ].map(([l, d]) => (
              <li key={l} className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span><strong className="text-gray-800">{l}</strong> — {d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
          Florida has <strong>no state income tax</strong> and no publication requirement — one of the easier states to operate in.
        </div>
        <button onClick={() => { window.open("https://dos.myflorida.com/sunbiz", "_blank", "noopener,noreferrer"); onNext(); }}
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
          File on Sunbiz <ExternalLink className="w-4 h-4" />
        </button>
        <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (state === "Texas") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          File a Certificate of Formation with the Texas Secretary of State. Texas processes same-day and has no publication requirement.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
              <p className="font-bold text-gray-900 text-lg mt-0.5">$300</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
              <p className="font-bold text-gray-900 text-lg mt-0.5">Same day</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">What you&apos;ll need</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {[
              ["Business name", businessName || "your chosen name"],
              ["Registered agent", "Texas address required (can be yours)"],
              ["Organizer name", "person filing the certificate"],
              ["Credit card", "for the $300 filing fee"],
            ].map(([l, d]) => (
              <li key={l} className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span><strong className="text-gray-800">{l}</strong> — {d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Texas has a <strong>franchise tax</strong> for businesses with over $2.47M in revenue. Most small businesses pay nothing.
          </p>
        </div>
        <button onClick={() => { window.open("https://www.sos.state.tx.us/corp/index.shtml", "_blank", "noopener,noreferrer"); onNext(); }}
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
          File on sos.state.tx.us <ExternalLink className="w-4 h-4" />
        </button>
        <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Fallback for any other state
  if (!info) return null;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
            <p className="font-bold text-gray-900 text-lg mt-0.5">{info.fee}</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
            <p className="font-bold text-gray-900 text-lg mt-0.5">{info.time}</p>
          </div>
        </div>
      </div>
      {info.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{info.notes}</p>
        </div>
      )}
      <button onClick={() => { window.open(info.url, "_blank", "noopener,noreferrer"); onNext(); }}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm">
        File your LLC in {state} <ExternalLink className="w-4 h-4" />
      </button>
      <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
        I already filed → Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SubStepHeader({ subSteps, current }: { subSteps: Array<{ title: string; optional?: boolean }>; current: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
      {subSteps.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5 shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            i < current ? "bg-indigo-100 text-indigo-600" :
            i === current ? "bg-indigo-600 text-white" :
            "bg-gray-100 text-gray-400"
          }`}>
            {i < current ? "✓ " : ""}{s.title}
            {s.optional && i !== current && <span className="ml-1 opacity-60">(optional)</span>}
          </div>
          {i < subSteps.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

export default function Step3LLC({ businessName, structure, state, subStep, onSubStepChange, onComplete }: Props) {
  const subSteps = FILING_SUBSTEPS[state];
  const hasSubSteps = subSteps && subSteps.length > 1;

  function advance() {
    if (hasSubSteps && subStep < subSteps.length - 1) {
      onSubStepChange(subStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete();
    }
  }

  if (structure === "sole") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          Good news — sole proprietors don&apos;t need to file anything with the state. You&apos;re automatically in business the moment you start.
        </p>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <p className="font-semibold text-emerald-800 mb-1">No state filing required</p>
          <p className="text-sm text-emerald-700">In {state || "your state"}, operating as a sole proprietor requires no formal registration.</p>
        </div>
        <ul className="space-y-3 text-sm text-gray-600">
          {[
            ["Fictitious Business Name (DBA)", `If your business name differs from your legal name, ${state || "your state"} requires a DBA filing with your county — usually $25–50.`],
            ["Local business license", "Most cities require a local business license regardless of structure — typically $50–100/year."],
            ["Separate bank account", "Keep business money separate from personal — makes taxes easier."],
          ].map(([title, desc]) => (
            <li key={title} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <span className="text-indigo-500 font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-gray-500 mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onComplete} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          Got it — continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (structure === "ccorp") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          Most investors expect a Delaware C-Corp. You can incorporate there even if you operate in {state || "your state"}.
        </p>
        <div className="space-y-2">
          <a href="https://stripe.com/atlas" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 border border-indigo-200 bg-indigo-50/50 rounded-xl px-4 py-3.5 hover:bg-indigo-50 transition-colors group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-gray-900 text-sm">Stripe Atlas</p>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-gray-500">$500 flat — Delaware C-Corp, EIN, Mercury bank account, and cap table all in one.</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 shrink-0" />
          </a>
          <a href="https://icis.corp.delaware.gov" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3.5 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">File directly in Delaware</p>
              <p className="text-xs text-gray-500">$90 fee, 1–3 day processing. You&apos;ll need a Delaware registered agent (~$50/yr).</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 shrink-0" />
          </a>
        </div>
        <button onClick={onComplete} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          I&apos;ve filed my C-Corp → Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // LLC and S-Corp — show sub-steps if the state has them
  return (
    <div className="space-y-0">
      {hasSubSteps && (
        <SubStepHeader subSteps={subSteps} current={subStep} />
      )}

      <SubStepContent
        state={state}
        subStepIndex={subStep}
        businessName={businessName}
        onNext={advance}
        onSkip={subSteps?.[subStep]?.optional ? advance : undefined}
        isLast={!hasSubSteps || subStep === (subSteps?.length ?? 1) - 1}
      />

      {structure === "scorp" && subStep === (subSteps?.length ?? 1) - 1 && (
        <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800 space-y-1">
          <p className="font-semibold">One more thing for S-Corps</p>
          <p>File <a href="https://www.irs.gov/forms-pubs/about-form-2553" target="_blank" rel="noopener noreferrer" className="underline font-medium">IRS Form 2553</a> within 75 days of forming to elect S-Corp tax status — it&apos;s free.</p>
        </div>
      )}
    </div>
  );
}
