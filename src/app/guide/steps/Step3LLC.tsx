"use client";

import { useState } from "react";
import { ExternalLink, ArrowRight, DollarSign, Clock } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: (data: { state: string }) => void;
}

const STATES: Record<string, { fee: string; time: string; url: string }> = {
  "Alabama": { fee: "$200", time: "1–2 weeks", url: "https://www.sos.alabama.gov/business-entities/llc" },
  "Alaska": { fee: "$250", time: "10–15 days", url: "https://www.commerce.alaska.gov/web/cbpl/BusinessLicensing.aspx" },
  "Arizona": { fee: "$50", time: "14–16 days", url: "https://ecorp.azcc.gov" },
  "Arkansas": { fee: "$45", time: "3–5 days", url: "https://www.sos.arkansas.gov/business-commercial-services-bcs" },
  "California": { fee: "$70", time: "3–5 days", url: "https://bizfileonline.sos.ca.gov" },
  "Colorado": { fee: "$50", time: "Same day", url: "https://www.sos.state.co.us/biz" },
  "Connecticut": { fee: "$120", time: "3–5 days", url: "https://www.concord-sots.ct.gov" },
  "Delaware": { fee: "$90", time: "1–3 days", url: "https://icis.corp.delaware.gov" },
  "Florida": { fee: "$125", time: "1–2 weeks", url: "https://dos.myflorida.com/sunbiz" },
  "Georgia": { fee: "$100", time: "7 days", url: "https://ecorp.sos.ga.gov" },
  "Hawaii": { fee: "$50", time: "3–5 days", url: "https://www.bizfilings.com/toolkit/research-topics/running-your-business/hawaii" },
  "Idaho": { fee: "$100", time: "Same day", url: "https://sosbiz.idaho.gov" },
  "Illinois": { fee: "$150", time: "10 days", url: "https://www.ilsos.gov/departments/business_services" },
  "Indiana": { fee: "$95", time: "1 day", url: "https://inbiz.in.gov" },
  "Iowa": { fee: "$50", time: "5 days", url: "https://sos.iowa.gov/business/FormsAndFees.html" },
  "Kansas": { fee: "$160", time: "3–5 days", url: "https://www.kssos.org/business/business.html" },
  "Kentucky": { fee: "$40", time: "3–5 days", url: "https://sos.ky.gov/bus/business-filings" },
  "Louisiana": { fee: "$100", time: "Same day", url: "https://www.geauxbiz.com" },
  "Maine": { fee: "$175", time: "1–2 weeks", url: "https://www.maine.gov/sos/cec/corp" },
  "Maryland": { fee: "$100", time: "4–6 weeks", url: "https://egov.maryland.gov/businessexpress" },
  "Massachusetts": { fee: "$500", time: "Same day", url: "https://corp.sec.state.ma.us" },
  "Michigan": { fee: "$50", time: "10 days", url: "https://www.michigan.gov/lara/0,4601,7-154-89334_61343_35413---,00.html" },
  "Minnesota": { fee: "$155", time: "3–5 days", url: "https://mblsportal.sos.state.mn.us" },
  "Mississippi": { fee: "$50", time: "1–2 weeks", url: "https://www.sos.ms.gov/Business-Services/Pages/default.aspx" },
  "Missouri": { fee: "$50", time: "3–5 days", url: "https://bsd.sos.mo.gov/" },
  "Montana": { fee: "$35", time: "3–5 days", url: "https://sosmt.gov/business" },
  "Nebraska": { fee: "$100", time: "2–3 weeks", url: "https://www.sos.ne.gov/business/corp_serv" },
  "Nevada": { fee: "$425", time: "Same day", url: "https://esos.nv.gov" },
  "New Hampshire": { fee: "$100", time: "5 days", url: "https://www.sos.nh.gov/corporate-division" },
  "New Jersey": { fee: "$125", time: "Same day", url: "https://www.njportal.com/DOR/BusinessFormation" },
  "New Mexico": { fee: "$50", time: "Same day", url: "https://www.sos.nm.gov/business-services" },
  "New York": { fee: "$200", time: "2–3 weeks", url: "https://www.dos.ny.gov/corps" },
  "North Carolina": { fee: "$125", time: "Same day", url: "https://www.sosnc.gov/divisions/business_registration" },
  "North Dakota": { fee: "$135", time: "2–5 days", url: "https://sos.nd.gov/business/business-services.html" },
  "Ohio": { fee: "$99", time: "Same day", url: "https://bsportal.ohiosos.gov/" },
  "Oklahoma": { fee: "$100", time: "3–5 days", url: "https://www.sos.ok.gov/business" },
  "Oregon": { fee: "$100", time: "Same day", url: "https://sos.oregon.gov/business" },
  "Pennsylvania": { fee: "$125", time: "1–2 weeks", url: "https://www.corporations.pa.gov" },
  "Rhode Island": { fee: "$150", time: "Same day", url: "https://www.sos.ri.gov/divisions/Business-Portal" },
  "South Carolina": { fee: "$110", time: "Same day", url: "https://businessfilings.sc.gov" },
  "South Dakota": { fee: "$150", time: "Same day", url: "https://sdsos.gov/business-services" },
  "Tennessee": { fee: "$300", time: "3–5 days", url: "https://sos.tn.gov/business" },
  "Texas": { fee: "$300", time: "Same day", url: "https://www.sos.state.tx.us/corp/index.shtml" },
  "Utah": { fee: "$54", time: "Same day", url: "https://secure.utah.gov/bes" },
  "Vermont": { fee: "$125", time: "3–5 days", url: "https://bizfilings.vermont.gov" },
  "Virginia": { fee: "$100", time: "Same day", url: "https://cis.scc.virginia.gov" },
  "Washington": { fee: "$200", time: "2–3 days", url: "https://www.sos.wa.gov/corporations-charities" },
  "West Virginia": { fee: "$100", time: "Same day", url: "https://apps.wv.gov/SOS/BusinessEntitySearch" },
  "Wisconsin": { fee: "$130", time: "Same day", url: "https://www.wdfi.org/corporations" },
  "Wyoming": { fee: "$100", time: "Same day", url: "https://wyobiz.wyo.gov" },
};

export default function Step3LLC({ businessName, onComplete }: Props) {
  const [state, setState] = useState("");
  const info = state ? STATES[state] : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        You&apos;ll file in the state where you live or primarily do business. Select yours below and we&apos;ll show you exactly where to go, what it costs, and how long it takes.
      </p>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Which state are you filing in?
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
        >
          <option value="">Select your state...</option>
          {Object.keys(STATES).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {!info && (
        <div className="border-2 border-dashed border-gray-150 rounded-xl p-10 text-center text-gray-300 text-sm">
          Select your state to see filing details
        </div>
      )}

      {info && (
        <div className="space-y-4">
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
                ["Credit or debit card", "for the filing fee"],
              ].map(([label, detail]) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  <span><strong className="text-gray-800">{label}</strong> — {detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => { window.open(info.url, "_blank", "noopener,noreferrer"); onComplete({ state }); }}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
          >
            File your LLC in {state}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center mb-4">
          Rather have someone handle it? <button onClick={() => { window.open("https://stripe.com/atlas", "_blank", "noopener,noreferrer"); onComplete({ state: state || "Delaware" }); }} className="text-indigo-500 hover:text-indigo-600 underline">Stripe Atlas</button> does the whole thing for $500 — popular for Delaware C-Corps.
        </p>
        <button
          disabled={!state}
          onClick={() => onComplete({ state })}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          I already filed → Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
