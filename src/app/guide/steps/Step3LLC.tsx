"use client";

import { ExternalLink, ArrowRight, DollarSign, Clock, AlertCircle } from "lucide-react";

interface Props {
  businessName: string;
  structure: string;
  state: string;
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
  "California":     { fee: "$70",  time: "3–5 days",     url: "https://bizfileonline.sos.ca.gov", notes: "California charges an $800/year minimum franchise tax for all LLCs and corporations — due every year." },
  "Colorado":       { fee: "$50",  time: "Same day",     url: "https://www.sos.state.co.us/biz" },
  "Connecticut":    { fee: "$120", time: "3–5 days",     url: "https://www.concord-sots.ct.gov" },
  "Delaware":       { fee: "$90",  time: "1–3 days",     url: "https://icis.corp.delaware.gov", notes: "Delaware is investor-preferred but has an annual franchise tax. Great for C-Corps, less necessary for most small LLCs." },
  "Florida":        { fee: "$125", time: "1–2 weeks",    url: "https://dos.myflorida.com/sunbiz" },
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
  "New York":       { fee: "$200", time: "2–3 weeks",    url: "https://www.dos.ny.gov/corps", notes: "New York has a publication requirement — after forming, you must publish a notice in two newspapers for 6 weeks, which can cost $1,000–2,000 depending on the county." },
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

export default function Step3LLC({ businessName, structure, state, onComplete }: Props) {
  const info = STATES[state];
  const label = structure === "scorp" ? "S-Corp" : structure === "ccorp" ? "C-Corp" : "LLC";

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
            ["Fictitious Business Name (FBN/DBA)", `If your business name differs from your legal name, ${state || "your state"} requires a DBA filing with your county — usually $25–50.`],
            ["Local business license", "Most cities require a local business license regardless of structure — typically $50–100/year."],
            ["Separate bank account", "Keep business money separate from personal — makes taxes easier and looks more professional."],
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

        <button
          onClick={onComplete}
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
          Most investors expect a Delaware C-Corp. You can incorporate there even if you operate in {state || "your state"} — just note that {state || "your state"} will require you to register as a foreign corporation too.
        </p>

        {info?.notes && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{info.notes}</p>
          </div>
        )}

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

        <button onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          I&apos;ve filed my C-Corp → Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // LLC and S-Corp
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        You&apos;re filing a {label} in <strong className="text-gray-700">{state}</strong>.{" "}
        {structure === "scorp" && "After your corporation is formed, you'll file IRS Form 2553 to elect S-Corp tax status."}
      </p>

      {info?.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{info.notes}</p>
        </div>
      )}

      {info ? (
        <>
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

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">What you&apos;ll need</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                ["Your business name", businessName || "your chosen name"],
                ["Registered agent address", `can be your home address in ${state}`],
                ["Names of all owners/members", "even if it's just you"],
                ["Credit or debit card", `for the ${info.fee} filing fee`],
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
              <p>1. File as a corporation with {state} below.</p>
              <p>2. File <a href="https://www.irs.gov/forms-pubs/about-form-2553" target="_blank" rel="noopener noreferrer" className="underline font-medium">IRS Form 2553</a> within 75 days to elect S-Corp tax status — free.</p>
            </div>
          )}

          <button
            onClick={() => { window.open(info.url, "_blank", "noopener,noreferrer"); onComplete(); }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
          >
            File your {label} in {state}
            <ExternalLink className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-4">
              Rather have someone handle it?{" "}
              <button onClick={() => { window.open("https://stripe.com/atlas", "_blank", "noopener,noreferrer"); onComplete(); }}
                className="text-indigo-500 hover:text-indigo-600 underline">
                Stripe Atlas
              </button>{" "}
              does the whole thing for $500.
            </p>
            <button onClick={onComplete}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
              I already filed → Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <button onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
