"use client";

import { useState } from "react";
import { ArrowRight, Check, Plus, Trash2, ExternalLink } from "lucide-react";

const PRICES: Record<string, { display: string; stateFee: string; stateCents: number; totalCents: number }> = {
  California: { display: "$149", stateFee: "$70",  stateCents: 7000,  totalCents: 14900 },
  Florida:    { display: "$199", stateFee: "$125", stateCents: 12500, totalCents: 19900 },
  "New York": { display: "$279", stateFee: "$200", stateCents: 20000, totalCents: 27900 },
  Texas:      { display: "$379", stateFee: "$300", stateCents: 30000, totalCents: 37900 },
};

const STATE_FILING_URLS: Record<string, { url: string; label: string; fee: string; time: string }> = {
  California: { url: "https://bizfileonline.sos.ca.gov", label: "California Secretary of State", fee: "$70", time: "3–5 business days" },
  Florida:    { url: "https://dos.myflorida.com/sunbiz",  label: "Florida Division of Corporations", fee: "$125", time: "Same day" },
  "New York": { url: "https://ecorp.dos.ny.gov/",          label: "New York Department of State",    fee: "$200", time: "2–3 weeks" },
  Texas:      { url: "https://www.sos.state.tx.us/corp/forms_boc.shtml", label: "Texas Secretary of State", fee: "$300", time: "Same day" },
};

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

type SubStep = "package" | "diy" | "contact" | "address" | "agent" | "ownership" | "management" | "review";

const SUBSTEP_LABELS: Record<SubStep, string> = {
  package:    "How would you like to file?",
  diy:        "File it yourself",
  contact:    "Your contact info",
  address:    "Your address",
  agent:      "Registered agent",
  ownership:  "Who owns this LLC?",
  management: "Management structure",
  review:     "Review your order",
};

const PROGRESS_STEPS: SubStep[] = ["contact", "address", "agent", "ownership", "management", "review"];

interface Member { name: string; ownership: string; }

interface Props {
  businessName: string;
  state: string;
  structure: string;
  companyId: string;
  userEmail: string;
  onComplete: () => void;
}

function ProgressBar({ current }: { current: SubStep }) {
  const idx = PROGRESS_STEPS.indexOf(current);
  if (idx < 0) return null;
  return (
    <div className="flex gap-1 mb-5">
      {PROGRESS_STEPS.map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= idx ? "bg-[#D4AF37]" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

function StepLabel({ sub }: { sub: SubStep }) {
  const idx = PROGRESS_STEPS.indexOf(sub);
  return (
    <div className="mb-5">
      {idx >= 0 && (
        <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">
          Step {idx + 1} of {PROGRESS_STEPS.length}
        </p>
      )}
      <h3 className="text-xl font-bold text-gray-900">{SUBSTEP_LABELS[sub]}</h3>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0 pt-0.5">{label}</p>
      <p className="text-sm text-gray-900 flex-1 leading-snug">{value || "—"}</p>
      {onEdit && (
        <button onClick={onEdit} className="text-xs text-[#D4AF37] hover:text-[#B8962E] font-semibold shrink-0 transition-colors">
          Edit
        </button>
      )}
    </div>
  );
}

function ContinueBtn({ disabled, onClick, label = "Continue" }: { disabled?: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
    >
      {label} <ArrowRight className="w-4 h-4" />
    </button>
  );
}

export default function StepFilingDetails({ businessName, state, structure, companyId, userEmail, onComplete }: Props) {
  const price = PRICES[state];

  const [sub, setSub] = useState<SubStep>("package");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [orgState, setOrgState] = useState(state || US_STATES[0]);
  const [zip, setZip] = useState("");
  const [isSelfAgent, setIsSelfAgent] = useState(true);
  const [agentName, setAgentName] = useState("");
  const [agentStreet, setAgentStreet] = useState("");
  const [agentCity, setAgentCity] = useState("");
  const [agentState, setAgentState] = useState(state || US_STATES[0]);
  const [agentZip, setAgentZip] = useState("");
  const [members, setMembers] = useState<Member[]>([{ name: "", ownership: "100" }]);
  const [mgmt, setMgmt] = useState<"member-managed" | "manager-managed">("member-managed");

  function go(next: SubStep) {
    setSub(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId, userEmail, businessName, state, structure,
          organizerName: name,
          addressLine1: street,
          city, zip, phone,
          details: {
            organizerState: orgState,
            managementType: mgmt,
            businessPurpose: "any lawful business purpose",
            isSelfAgent,
            registeredAgent: isSelfAgent ? null : { name: agentName, street: agentStreet, city: agentCity, state: agentState, zip: agentZip },
            members,
          },
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  // Sole prop / C-Corp bypass
  if (structure === "sole") {
    return (
      <div className="space-y-5">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <p className="font-semibold text-emerald-800">No filing service needed</p>
          <p className="text-sm text-emerald-700 mt-1">Sole proprietors don't file formation documents — you're already in business.</p>
        </div>
        <ContinueBtn onClick={onComplete} />
      </div>
    );
  }

  if (structure === "ccorp") {
    return (
      <div className="space-y-5">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="font-semibold text-blue-800">C-Corp filing is handled separately</p>
          <p className="text-sm text-blue-700 mt-1">Use Stripe Atlas or file directly with Delaware — covered in the Get Official step.</p>
        </div>
        <ContinueBtn onClick={onComplete} />
      </div>
    );
  }

  // Package selection
  if (sub === "package") {
    return (
      <div className="space-y-5">
        <StepLabel sub="package" />
        <p className="text-sm text-gray-500 -mt-3">
          You're forming a <strong className="text-gray-800">{state} {structure === "scorp" ? "S-Corp" : "LLC"}</strong>.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => go("diy")}
            className="w-full text-left border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl p-5 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900">File it myself</p>
                <p className="text-sm text-gray-500 mt-1">I'll handle the paperwork on the state website.</p>
                <ul className="mt-3 space-y-1.5">
                  {["File directly on the state website", "Takes 30–60 minutes", "Pay state fee directly"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-gray-300">→</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="text-lg font-bold text-gray-400 shrink-0">Free</span>
            </div>
          </button>

          {price ? (
            <button
              onClick={() => go("contact")}
              className="w-full text-left border-2 border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 rounded-xl p-5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">We file it for you</p>
                    <span className="text-xs font-semibold bg-[#D4AF37] text-white px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">We handle the paperwork, track your filing, and send your certificate.</p>
                  <ul className="mt-3 space-y-1.5">
                    {[
                      `Includes ${price.stateFee} state filing fee`,
                      "We prepare & file Articles of Organization",
                      "Filing status updates by email",
                      "Certificate forwarded when approved",
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check className="w-3 h-3 text-[#D4AF37] shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="text-2xl font-bold text-gray-900 shrink-0">{price.display}</span>
              </div>
            </button>
          ) : (
            <div className="border border-gray-100 rounded-xl p-5 text-sm text-gray-400">
              Filing service not yet available for {state}.
            </div>
          )}
        </div>
      </div>
    );
  }

  // DIY filing link
  if (sub === "diy") {
    const portal = STATE_FILING_URLS[state];
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1">File it yourself</p>
          <h3 className="text-xl font-bold text-gray-900">Go file on the state website</h3>
        </div>

        {portal ? (
          <>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 flex gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Filing fee</p>
                <p className="text-xl font-bold text-gray-900">{portal.fee}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Processing time</p>
                <p className="text-xl font-bold text-gray-900">{portal.time}</p>
              </div>
            </div>

            <a
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold px-5 py-4 rounded-xl transition-colors"
            >
              <span>File with {portal.label}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>

            <div className="space-y-2 text-sm text-gray-500">
              <p className="font-semibold text-gray-700">What you'll need on the site:</p>
              <ul className="space-y-1.5">
                {[
                  `Your LLC name: ${businessName || "your business name"}`,
                  "Registered agent name and address",
                  "Your name as organizer",
                  `Credit card for the ${portal.fee} state fee`,
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#D4AF37] shrink-0 font-bold">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Search for &ldquo;{state} LLC filing&rdquo; on your Secretary of State website to file directly.</p>
        )}

        <button
          onClick={onComplete}
          className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          I&apos;ve filed (or I&apos;ll do it later) — Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Contact
  if (sub === "contact") {
    const ok = name.trim() !== "" && phone.trim() !== "";
    return (
      <div className="space-y-5">
        <ProgressBar current={sub} />
        <StepLabel sub={sub} />
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full legal name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" type="tel"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
        </div>
        <ContinueBtn disabled={!ok} onClick={() => go("address")} />
      </div>
    );
  }

  // Address
  if (sub === "address") {
    const ok = street.trim() !== "" && city.trim() !== "" && zip.trim() !== "";
    return (
      <div className="space-y-5">
        <ProgressBar current={sub} />
        <StepLabel sub={sub} />
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Street address</label>
            <input value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Los Angeles"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label>
              <select value={orgState} onChange={e => setOrgState(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                {US_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">ZIP code</label>
              <input value={zip} onChange={e => setZip(e.target.value)} placeholder="90001"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
          </div>
        </div>
        <ContinueBtn disabled={!ok} onClick={() => go("agent")} />
      </div>
    );
  }

  // Registered agent
  if (sub === "agent") {
    const customOk = agentName.trim() !== "" && agentStreet.trim() !== "" && agentCity.trim() !== "" && agentZip.trim() !== "";
    const ok = isSelfAgent || customOk;
    return (
      <div className="space-y-5">
        <ProgressBar current={sub} />
        <StepLabel sub={sub} />
        <p className="text-sm text-gray-500 -mt-3">
          A registered agent receives official mail and legal documents for your LLC. They must have a {state} address.
        </p>
        <div className="space-y-3">
          {([
            { value: true,  label: "I'll be my own registered agent", desc: "Use your own address. Free. Works for most small LLCs." },
            { value: false, label: "Use a different registered agent", desc: `Enter the name and ${state} address of another person or service.` },
          ] as const).map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => setIsSelfAgent(opt.value)}
              className={`w-full text-left border rounded-xl p-4 transition-all ${
                isSelfAgent === opt.value ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelfAgent === opt.value ? "border-[#D4AF37] bg-[#D4AF37]" : "border-gray-300"
                }`}>
                  {isSelfAgent === opt.value && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {!isSelfAgent && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Agent full name</label>
              <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Jane Smith"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Street address</label>
              <input value={agentStreet} onChange={e => setAgentStreet(e.target.value)} placeholder="123 Main St"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
              <input value={agentCity} onChange={e => setAgentCity(e.target.value)} placeholder="Los Angeles"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label>
                <select value={agentState} onChange={e => setAgentState(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                  {US_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">ZIP code</label>
                <input value={agentZip} onChange={e => setAgentZip(e.target.value)} placeholder="90001"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
              </div>
            </div>
          </div>
        )}
        <ContinueBtn disabled={!ok} onClick={() => go("ownership")} />
      </div>
    );
  }

  // Ownership
  if (sub === "ownership") {
    const total = Math.round(members.reduce((s, m) => s + (parseFloat(m.ownership) || 0), 0));
    const ok = members.every(m => m.name.trim() !== "" && m.ownership.trim() !== "") && total === 100;
    return (
      <div className="space-y-5">
        <ProgressBar current={sub} />
        <StepLabel sub={sub} />
        <p className="text-sm text-gray-500 -mt-3">Add each owner and their ownership %. Total must equal 100%.</p>
        <div className="space-y-2">
          {members.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={m.name}
                onChange={e => setMembers(ms => ms.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                placeholder="Full legal name"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <div className="relative w-24 shrink-0">
                <input
                  value={m.ownership}
                  onChange={e => setMembers(ms => ms.map((x, j) => j === i ? { ...x, ownership: e.target.value } : x))}
                  placeholder="100"
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] pr-6"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">%</span>
              </div>
              {members.length > 1 && (
                <button onClick={() => setMembers(ms => ms.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setMembers(ms => [...ms, { name: "", ownership: "" }])}
          className="flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#B8962E] font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add another member
        </button>
        <p className={`text-sm font-semibold ${total === 100 ? "text-emerald-600" : "text-red-500"}`}>
          Total: {total}%{total === 100 ? " ✓" : " — must equal 100%"}
        </p>
        <ContinueBtn disabled={!ok} onClick={() => go("management")} />
      </div>
    );
  }

  // Management
  if (sub === "management") {
    return (
      <div className="space-y-5">
        <ProgressBar current={sub} />
        <StepLabel sub={sub} />
        <p className="text-sm text-gray-500 -mt-3">How will your LLC be managed day-to-day?</p>
        <div className="space-y-3">
          {([
            { value: "member-managed" as const,  label: "Member-managed",  desc: "All owners manage the business together. Best for most small LLCs and solo founders." },
            { value: "manager-managed" as const, label: "Manager-managed", desc: "One or more appointed managers run operations. Common when some members are passive investors." },
          ]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setMgmt(opt.value)}
              className={`w-full text-left border rounded-xl p-4 transition-all ${
                mgmt === opt.value ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  mgmt === opt.value ? "border-[#D4AF37] bg-[#D4AF37]" : "border-gray-300"
                }`}>
                  {mgmt === opt.value && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <ContinueBtn onClick={() => go("review")} />
      </div>
    );
  }

  // Review & place order
  if (sub === "review") {
    const serviceFee = price ? Math.round((price.totalCents - price.stateCents) / 100) : 0;
    return (
      <div className="space-y-5">
        <ProgressBar current={sub} />
        <StepLabel sub={sub} />

        <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden">
          <div className="px-5 py-4 space-y-3">
            <ReviewRow label="Business" value={businessName} />
            <ReviewRow label="State" value={state} />
          </div>
          <div className="px-5 py-4 space-y-3">
            <ReviewRow label="Organizer" value={name} onEdit={() => go("contact")} />
            <ReviewRow label="Phone" value={phone} onEdit={() => go("contact")} />
            <ReviewRow label="Address" value={`${street}, ${city}, ${orgState} ${zip}`} onEdit={() => go("address")} />
          </div>
          <div className="px-5 py-4 space-y-3">
            <ReviewRow
              label="Reg. agent"
              value={isSelfAgent ? "Self (you)" : `${agentName}, ${agentCity} ${agentState}`}
              onEdit={() => go("agent")}
            />
          </div>
          <div className="px-5 py-4 space-y-3">
            <ReviewRow
              label="Members"
              value={members.map(m => `${m.name} (${m.ownership}%)`).join(", ")}
              onEdit={() => go("ownership")}
            />
            <ReviewRow
              label="Management"
              value={mgmt === "member-managed" ? "Member-managed" : "Manager-managed"}
              onEdit={() => go("management")}
            />
          </div>
        </div>

        {price && (
          <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
            <div className="flex justify-between px-5 py-3">
              <span className="text-gray-500">Service fee</span>
              <span className="font-semibold text-gray-900">${serviceFee}</span>
            </div>
            <div className="flex justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-gray-500">{state} state filing fee</span>
              <span className="font-semibold text-gray-900">{price.stateFee}</span>
            </div>
            <div className="flex justify-between px-5 py-3 bg-gray-50 border-t border-gray-100 font-bold">
              <span className="text-gray-900">Total due today</span>
              <span className="text-gray-900 text-base">{price.display}</span>
            </div>
          </div>
        )}

        <button
          disabled={loading}
          onClick={handlePlaceOrder}
          className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-[#D4AF37]/20"
        >
          {loading ? "Placing order…" : "Place order"}{!loading && <ArrowRight className="w-5 h-5" />}
        </button>
        <p className="text-xs text-center text-gray-400">Secure payment via Stripe · One-time charge · No subscription</p>
      </div>
    );
  }

  return null;
}
