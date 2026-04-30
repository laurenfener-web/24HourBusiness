"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronRight, DollarSign, Clock, AlertCircle } from "lucide-react";
import { OFFICIAL_SUBSTEPS, type SubStepKind } from "../GuideClient";

interface Props {
  businessName: string;
  state: string;
  structure: string;
  subStep: number;
  onSubStepChange: (n: number) => void;
  onStructureChange: (s: string) => void;
  onComplete: () => void;
}

// ─── Shared UI helpers ──────────────────────────────────────────────────────

function FeeTimeGrid({ fee, time }: { fee: string; time: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
        <DollarSign className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filing fee</p>
          <p className="font-bold text-gray-900 text-lg mt-0.5">{fee}</p>
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Processing</p>
          <p className="font-bold text-gray-900 text-lg mt-0.5">{time}</p>
        </div>
      </div>
    </div>
  );
}

function WhatYouNeed({ items }: { items: [string, string][] }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-800 mb-2">What you&apos;ll need</p>
      <ul className="space-y-1.5 text-sm text-gray-600">
        {items.map(([l, d]) => (
          <li key={l} className="flex items-start gap-2">
            <span className="text-emerald-500 shrink-0">✓</span>
            <span><strong className="text-gray-800">{l}</strong> — {d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContinueBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
    >
      {label} <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ─── Structure sub-step ─────────────────────────────────────────────────────

const STRUCTURE_OPTIONS = [
  {
    id: "llc",
    label: "LLC",
    subtitle: "Limited Liability Company",
    best: "Most founders",
    description: "The go-to choice for most first-time founders. You get personal liability protection without the complexity of a corporation.",
    pros: ["Protects personal assets", "Simple to run", "Flexible tax treatment", "Easy to maintain"],
    cons: ["Annual state fees apply"],
    recommended: true,
  },
  {
    id: "sole",
    label: "Sole Proprietorship",
    subtitle: "Just you, no registration",
    best: "Freelancers testing an idea",
    description: "No paperwork, no fees — but your personal assets are on the line if anything goes wrong.",
    pros: ["Zero setup cost", "No paperwork", "Simplest option"],
    cons: ["No liability protection", "Harder to get funding", "Personal assets at risk"],
    recommended: false,
  },
  {
    id: "scorp",
    label: "S-Corp",
    subtitle: "Tax savings at scale",
    best: "Profitable businesses ($80k+ per year)",
    description: "Once you're making real money, an S-Corp can save you thousands in self-employment taxes. Talk to an accountant first.",
    pros: ["Significant tax savings", "Credible business structure"],
    cons: ["Requires payroll", "More complex to manage", "Annual maintenance costs"],
    recommended: false,
  },
  {
    id: "ccorp",
    label: "C-Corp",
    subtitle: "Built for venture funding",
    best: "Raising VC money",
    description: "If you plan to raise institutional money, investors will expect a Delaware C-Corp. Otherwise, it's overkill.",
    pros: ["Investors expect it", "Easy to issue equity", "Delaware-friendly ecosystem"],
    cons: ["Double taxation", "Most complex to run", "Expensive to maintain"],
    recommended: false,
  },
];

function StructureContent({
  structure,
  state,
  onComplete,
}: {
  structure: string;
  state: string;
  onComplete: (s: string) => void;
}) {
  const [selected, setSelected] = useState(structure || "llc");
  const current = STRUCTURE_OPTIONS.find((o) => o.id === selected)!;

  return (
    <div className="space-y-5">
      <p className="text-gray-500 text-sm leading-relaxed">
        For most first-time founders in <strong className="text-gray-900">{state}</strong>, an{" "}
        <strong className="text-gray-900">LLC</strong> is the right move — it protects your personal assets and is simple to run.
      </p>

      <div className="space-y-2">
        {STRUCTURE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`w-full text-left border rounded-xl p-5 transition-all ${
              selected === opt.id
                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                selected === opt.id ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
              }`}>
                {selected === opt.id && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900">{opt.label}</span>
                  <span className="text-gray-400 text-sm">— {opt.subtitle}</span>
                  {opt.recommended && (
                    <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Best for: {opt.best}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div>
          <p className="font-semibold text-gray-900 mb-1">{current.label} — what to know</p>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-emerald-700 mb-2">Pros</p>
            <ul className="space-y-1.5">
              {current.pros.map((p) => (
                <li key={p} className="flex items-start gap-2 text-gray-600">
                  <span className="text-emerald-500 mt-0.5">+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-500 mb-2">Cons</p>
            <ul className="space-y-1.5">
              {current.cons.map((c) => (
                <li key={c} className="flex items-start gap-2 text-gray-600">
                  <span className="text-red-400 mt-0.5">–</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={() => onComplete(selected)}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        Go with {current.label} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Name check sub-step (California only) ──────────────────────────────────

function NameCheckContent({
  businessName,
  onNext,
  onSkip,
}: {
  businessName: string;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Before filing, confirm your business name is available in California. This prevents a rejected filing and only takes a minute.
      </p>
      {businessName && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-sm text-indigo-800">
            Search for <strong>&ldquo;{businessName}&rdquo;</strong> in the California Secretary of State&apos;s business name database to confirm it&apos;s available.
          </p>
        </div>
      )}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
        Search the <strong className="text-gray-800">California Secretary of State</strong> business name database at bizfileonline.sos.ca.gov before you file.
      </div>
      <ContinueBtn label="Name is available → Continue" onClick={onNext} />
      <button
        onClick={onSkip}
        className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-1 transition-colors"
      >
        Skip — I already checked →
      </button>
    </div>
  );
}

// ─── Filing sub-step ────────────────────────────────────────────────────────

function FilingContent({
  state,
  structure,
  businessName,
  onNext,
}: {
  state: string;
  structure: string;
  businessName: string;
  onNext: () => void;
}) {
  if (structure === "sole") {
    return (
      <div className="space-y-5">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <p className="font-semibold text-emerald-800 mb-1">No state filing required</p>
          <p className="text-sm text-emerald-700">
            Sole proprietors don&apos;t need to file anything with {state}. You&apos;re in business the moment you start.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-gray-600">
          {[
            ["Fictitious Business Name (DBA)", `If your business name differs from your legal name, you'll need a DBA filing with your county — usually $25–50.`],
            ["Local business license", "Most cities require a local license — typically $50–100/year."],
            ["Separate bank account", "Keep business money separate from personal — makes taxes much easier."],
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
        <ContinueBtn label="Got it — continue" onClick={onNext} />
      </div>
    );
  }

  if (structure === "ccorp") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          Most investors expect a Delaware C-Corp. You can incorporate there even if you operate in {state}.
        </p>
        <div className="space-y-2">
          <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold text-gray-900 text-sm">Stripe Atlas</p>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Recommended</span>
            </div>
            <p className="text-xs text-gray-500">$500 flat — Delaware C-Corp, EIN, Mercury bank account, and cap table all in one. Search "Stripe Atlas" to get started.</p>
          </div>
          <div className="border border-gray-100 rounded-xl px-4 py-3.5">
            <p className="font-semibold text-gray-900 text-sm">File directly in Delaware</p>
            <p className="text-xs text-gray-500">$90 fee, 1–3 day processing. You&apos;ll need a Delaware registered agent (~$50/yr). Search "Delaware Division of Corporations."</p>
          </div>
        </div>
        <ContinueBtn label="I've filed my C-Corp → Continue" onClick={onNext} />
      </div>
    );
  }

  // LLC / S-Corp — state-specific content
  if (state === "Florida") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          File your Articles of Organization with the Florida Division of Corporations. Florida processes same-day — one of the fastest in the country.
        </p>
        <FeeTimeGrid fee="$125" time="Same day" />
        <WhatYouNeed items={[
          ["Business name", businessName || "your chosen name"],
          ["Registered agent", "Florida address required (can be yours)"],
          ["Member names", "everyone who owns the LLC"],
          ["Credit card", "for the $125 filing fee"],
        ]} />
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
          Florida has <strong>no state income tax</strong> and no publication requirement — one of the friendliest states for small businesses.
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
          File through the <strong className="text-gray-800">Florida Division of Corporations</strong> (Sunbiz) online portal at dos.myflorida.com/sunbiz.
        </div>
        {structure === "scorp" && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <p className="font-semibold mb-1">S-Corp election</p>
            <p>After your LLC is approved, file IRS Form 2553 within 75 days to elect S-Corp tax treatment — it&apos;s free. Find it at irs.gov.</p>
          </div>
        )}
        <ContinueBtn label="I've filed → Continue" onClick={onNext} />
      </div>
    );
  }

  if (state === "California") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          File your Articles of Organization with the California Secretary of State. This is the official document that creates your LLC.
        </p>
        <FeeTimeGrid fee="$70" time="3–5 days" />
        <WhatYouNeed items={[
          ["Business name", businessName || "your chosen name"],
          ["Registered agent", "can be your California home address"],
          ["Member names", "everyone who owns the LLC"],
          ["Credit card", "for the $70 filing fee"],
        ]} />
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            California charges an <strong>$800/year minimum franchise tax</strong> starting your first year — even if you earn nothing.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <strong>While you wait (3–5 days):</strong> Use the processing time to get your EIN — that&apos;s the very next step.
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
          File through the <strong className="text-gray-800">California Secretary of State</strong> at bizfileonline.sos.ca.gov.
        </div>
        {structure === "scorp" && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <p className="font-semibold mb-1">S-Corp election</p>
            <p>After your LLC is approved, file IRS Form 2553 within 75 days to elect S-Corp tax treatment — free at irs.gov.</p>
          </div>
        )}
        <ContinueBtn label="I've filed → Continue" onClick={onNext} />
      </div>
    );
  }

  if (state === "New York") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          File your Articles of Organization with the New York Department of State to officially create your LLC.
        </p>
        <FeeTimeGrid fee="$200" time="2–3 weeks" />
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Plan ahead:</strong> After this, New York requires you to publish in two newspapers — adds $1,000–2,000+ in costs. You&apos;ll get your EIN while you wait for Articles to process (2–3 weeks), then begin publication.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <strong>While you wait (2–3 weeks):</strong> Get your EIN — next step. Then you&apos;ll start the publication process once your Articles are approved.
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
          File through the <strong className="text-gray-800">New York Department of State</strong> online portal at dos.ny.gov/corps.
        </div>
        {structure === "scorp" && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <p className="font-semibold mb-1">S-Corp election</p>
            <p>After your LLC is approved, file IRS Form 2553 within 75 days to elect S-Corp tax treatment — free at irs.gov.</p>
          </div>
        )}
        <ContinueBtn label="I've filed → Continue" onClick={onNext} />
      </div>
    );
  }

  if (state === "Texas") {
    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          File a Certificate of Formation with the Texas Secretary of State. Texas processes same-day and has no publication requirement.
        </p>
        <FeeTimeGrid fee="$300" time="Same day" />
        <WhatYouNeed items={[
          ["Business name", businessName || "your chosen name"],
          ["Registered agent", "Texas address required (can be yours)"],
          ["Organizer name", "the person filing the certificate"],
          ["Credit card", "for the $300 filing fee"],
        ]} />
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Texas has a <strong>franchise tax</strong> only for businesses with over $2.47M in revenue. Most small businesses owe nothing.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
          File through the <strong className="text-gray-800">Texas Secretary of State</strong> (SOSDirect) at sos.state.tx.us.
        </div>
        {structure === "scorp" && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800">
            <p className="font-semibold mb-1">S-Corp election</p>
            <p>After your LLC is approved, file IRS Form 2553 within 75 days to elect S-Corp tax treatment — free at irs.gov.</p>
          </div>
        )}
        <ContinueBtn label="I've filed → Continue" onClick={onNext} />
      </div>
    );
  }

  return null;
}

// ─── EIN sub-step ───────────────────────────────────────────────────────────

function EINContent({
  businessName,
  state,
  hint,
  onNext,
}: {
  businessName: string;
  state: string;
  hint?: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      {hint && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <strong>Good timing:</strong> {hint} — it only takes about 10 minutes and you&apos;ll have it ready when your LLC is approved.
        </div>
      )}

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-emerald-600 text-base font-bold">$</span>
        </div>
        <div>
          <p className="font-semibold text-emerald-900 text-sm">100% free. Takes 10 minutes.</p>
          <p className="text-emerald-700 text-sm mt-0.5">The IRS gives you an EIN instantly online — no fees, no waiting, no third-party services needed.</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">What is an EIN?</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your Employer Identification Number is your business&apos;s tax ID — like a Social Security number for your LLC. You need it to open a business bank account, file taxes, and hire employees. Even solo founders need one.
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">What you&apos;ll need</p>
        <ul className="space-y-2.5">
          {[
            ["Your LLC name", businessName || "your business name"],
            ["State of formation", state],
            ["Your personal SSN", "as the responsible party"],
            ["About 10 minutes", "the form is straightforward"],
          ].map(([label, detail], i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <span className="text-sm text-gray-400"> — {detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Save your confirmation PDF.</strong> The IRS shows your EIN at the end — download it and store it permanently. Banks and accountants will ask for it repeatedly.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
        Apply at <strong className="text-gray-800">IRS.gov</strong> — search "IRS EIN online application" or go to sa.www4.irs.gov/applyein.
      </div>

      <ContinueBtn label="I have my EIN → Continue" onClick={onNext} />
    </div>
  );
}

// ─── Statement of Information (California only) ─────────────────────────────

function StatementOfInfoContent({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        California requires you to file a Statement of Information within <strong className="text-gray-700">90 days</strong> of forming your LLC. It&apos;s a short form confirming your address, registered agent, and members.
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
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Don&apos;t miss this — failing to file the Statement of Information on time can result in a $250 penalty and suspension of your LLC.
        </p>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
        File through the <strong className="text-gray-800">California Secretary of State</strong> — same portal as your Articles of Organization at bizfileonline.sos.ca.gov.
      </div>
      <ContinueBtn label="Statement filed → Continue" onClick={onNext} />
    </div>
  );
}

// ─── Publication (New York only) ─────────────────────────────────────────────

function PublishContent({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-red-50 border border-red-100 rounded-xl p-5">
        <p className="font-semibold text-red-800 mb-1">New York&apos;s publication requirement</p>
        <p className="text-sm text-red-700 leading-relaxed">
          Within 120 days of your LLC being approved, New York law requires you to publish a notice in <strong>two newspapers</strong> in your county for 6 consecutive weeks. This typically costs <strong>$1,000–2,000+</strong> depending on your county.
        </p>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-sm text-gray-600">
        <p className="font-semibold text-gray-800">How to do it:</p>
        <ol className="space-y-1.5 list-decimal list-inside">
          <li>Contact your county clerk for the list of approved newspapers</li>
          <li>Contact each newspaper to place the required notice (~$500–1,000 each)</li>
          <li>After 6 weeks, each paper provides an Affidavit of Publication</li>
          <li>Use those affidavits to file the Certificate of Publication (next step)</li>
        </ol>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Start this as soon as your Articles are approved — you only have 120 days, and publication itself takes 6 weeks.
        </p>
      </div>
      <ContinueBtn label="I've published for 6 weeks → Continue" onClick={onNext} />
    </div>
  );
}

// ─── Certificate of Publication (New York only) ──────────────────────────────

function CertOfPubContent({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        After your 6-week publication period ends and you have Affidavits of Publication from both newspapers, file the Certificate of Publication with New York to complete your LLC formation.
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
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
        Once this is filed, your New York LLC is fully formed. The hardest part — publication — is behind you.
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
        File through the <strong className="text-gray-800">New York Department of State</strong> — same portal as your Articles of Organization at dos.ny.gov/corps.
      </div>
      <ContinueBtn label="Certificate filed → Continue" onClick={onNext} />
    </div>
  );
}

// ─── Sub-step header navigation ─────────────────────────────────────────────

function SubStepHeader({
  subSteps,
  current,
}: {
  subSteps: Array<{ title: string; optional?: boolean; hint?: string }>;
  current: number;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
      {subSteps.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5 shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            i < current ? "bg-indigo-100 text-indigo-600" :
            i === current ? "bg-indigo-600 text-white" :
            "bg-gray-100 text-gray-400"
          }`}>
            {i < current && "✓ "}{s.title}
            {s.optional && i !== current && <span className="ml-1 opacity-60">(opt)</span>}
          </div>
          {i < subSteps.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function StepGetOfficial({
  businessName,
  state,
  structure,
  subStep,
  onSubStepChange,
  onStructureChange,
  onComplete,
}: Props) {
  const subSteps = OFFICIAL_SUBSTEPS[state] ?? [];
  const current = subSteps[subStep];

  function advance() {
    if (subStep < subSteps.length - 1) {
      onSubStepChange(subStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete();
    }
  }

  if (!current) return null;

  const kind: SubStepKind = current.kind;

  return (
    <div className="space-y-0">
      {subSteps.length > 1 && (
        <SubStepHeader subSteps={subSteps} current={subStep} />
      )}

      {kind === "structure" && (
        <StructureContent
          structure={structure}
          state={state}
          onComplete={(s) => {
            onStructureChange(s);
            advance();
          }}
        />
      )}

      {kind === "name-check" && (
        <NameCheckContent
          businessName={businessName}
          onNext={advance}
          onSkip={advance}
        />
      )}

      {kind === "file" && (
        <FilingContent
          state={state}
          structure={structure}
          businessName={businessName}
          onNext={advance}
        />
      )}

      {kind === "ein" && (
        <EINContent
          businessName={businessName}
          state={state}
          hint={current.hint}
          onNext={advance}
        />
      )}

      {kind === "statement-of-info" && (
        <StatementOfInfoContent onNext={advance} />
      )}

      {kind === "publish" && (
        <PublishContent onNext={advance} />
      )}

      {kind === "cert-of-pub" && (
        <CertOfPubContent onNext={advance} />
      )}
    </div>
  );
}
