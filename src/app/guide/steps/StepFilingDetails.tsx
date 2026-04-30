"use client";

import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

interface Props {
  businessName: string;
  state: string;
  structure: string;
  companyId: string;
  userEmail: string;
  onComplete: () => void;
}

const PRICES: Record<string, { display: string; stateFee: string }> = {
  California: { display: "$149", stateFee: "$70" },
  Florida:    { display: "$199", stateFee: "$125" },
  "New York": { display: "$279", stateFee: "$200" },
  Texas:      { display: "$379", stateFee: "$300" },
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

const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]";
const SECTION_HEADING_CLS = "text-xs font-bold uppercase tracking-widest text-gray-500 mb-3";

interface Member {
  name: string;
  ownership: string;
}

interface FormState {
  organizerName: string;
  phone: string;
  street: string;
  city: string;
  organizerState: string;
  zip: string;
  isSelfAgent: boolean;
  agentName: string;
  agentStreet: string;
  agentCity: string;
  agentState: string;
  agentZip: string;
  managementType: "member-managed" | "manager-managed";
  businessPurpose: string;
}

export default function StepFilingDetails({
  businessName,
  state,
  structure,
  companyId,
  userEmail,
  onComplete,
}: Props) {
  // Sole proprietor — no filing needed
  if (structure === "sole") {
    return (
      <div className="space-y-5">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <p className="font-semibold text-emerald-800 mb-1">No filing service needed</p>
          <p className="text-sm text-emerald-700">
            Sole proprietors don&apos;t file with the state to form their business, so there&apos;s nothing for us to file on your behalf.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // C-Corp — handled elsewhere
  if (structure === "ccorp") {
    return (
      <div className="space-y-5">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="font-semibold text-blue-800 mb-1">C-Corp filing via Stripe Atlas or Delaware direct</p>
          <p className="text-sm text-blue-700">
            C-Corp formation is handled through Stripe Atlas (recommended) or by filing directly with Delaware. Our service covers LLCs and S-Corps only.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // LLC / S-Corp but state not supported
  const price = PRICES[state];
  if (!price) {
    return (
      <div className="space-y-5">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="font-semibold text-gray-800 mb-1">Filing service not yet available for {state || "your state"}</p>
          <p className="text-sm text-gray-500">
            We currently support California, Florida, New York, and Texas. You can file directly with {state || "your state"}&apos;s Secretary of State using the instructions in the previous step.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // LLC / S-Corp with supported state — show full form
  return (
    <FilingServiceForm
      businessName={businessName}
      state={state}
      structure={structure}
      companyId={companyId}
      userEmail={userEmail}
      price={price}
      onComplete={onComplete}
    />
  );
}

function FilingServiceForm({
  businessName,
  state,
  structure,
  companyId,
  userEmail,
  price,
  onComplete,
}: {
  businessName: string;
  state: string;
  structure: string;
  companyId: string;
  userEmail: string;
  price: { display: string; stateFee: string };
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    organizerName: "",
    phone: "",
    street: "",
    city: "",
    organizerState: state,
    zip: "",
    isSelfAgent: true,
    agentName: "",
    agentStreet: "",
    agentCity: "",
    agentState: state,
    agentZip: "",
    managementType: "member-managed",
    businessPurpose: "To engage in any lawful business activity",
  });

  const [members, setMembers] = useState<Member[]>([{ name: "", ownership: "100" }]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addMember() {
    setMembers((m) => [...m, { name: "", ownership: "" }]);
  }

  function removeMember(idx: number) {
    setMembers((m) => m.filter((_, i) => i !== idx));
  }

  function updateMember(idx: number, field: keyof Member, value: string) {
    setMembers((m) => m.map((mem, i) => (i === idx ? { ...mem, [field]: value } : mem)));
  }

  const totalOwnership = members.reduce((sum, m) => {
    const pct = parseFloat(m.ownership);
    return sum + (isNaN(pct) ? 0 : pct);
  }, 0);
  const ownershipOk = Math.round(totalOwnership) === 100;

  const isComplete =
    form.organizerName.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.street.trim() !== "" &&
    form.city.trim() !== "" &&
    form.organizerState.trim() !== "" &&
    form.zip.trim() !== "" &&
    (form.isSelfAgent ||
      (form.agentName.trim() !== "" &&
        form.agentStreet.trim() !== "" &&
        form.agentCity.trim() !== "" &&
        form.agentState.trim() !== "" &&
        form.agentZip.trim() !== "")) &&
    members.every((m) => m.name.trim() !== "" && m.ownership.trim() !== "") &&
    ownershipOk;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete) return;
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        userEmail,
        businessName,
        state,
        structure,
        organizerName: form.organizerName,
        addressLine1: form.street,
        city: form.city,
        zip: form.zip,
        phone: form.phone,
        details: {
          organizerState: form.organizerState,
          managementType: form.managementType,
          businessPurpose: form.businessPurpose,
          isSelfAgent: form.isSelfAgent,
          registeredAgent: form.isSelfAgent
            ? null
            : {
                name: form.agentName,
                street: form.agentStreet,
                city: form.agentCity,
                state: form.agentState,
                zip: form.agentZip,
              },
          members,
        },
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div className="rounded-xl border-2 border-[#D4AF37]/40 bg-[#D4AF37]/6 overflow-hidden">
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 text-base">We&apos;ll file it for you</p>
            <p className="text-sm text-gray-500 mt-0.5">You focus on the business. We handle the paperwork.</p>
          </div>
          <p className="font-bold text-2xl text-gray-900 shrink-0">{price.display}</p>
        </div>

        <ul className="mt-4 space-y-1.5">
          {[
            `File your Articles of Organization with ${state}`,
            "Track your filing status",
            "Forward your approval certificate",
            `Includes ${price.stateFee} state filing fee`,
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="mt-5 w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            File my {state} {structure === "scorp" ? "S-Corp" : "LLC"} for {price.display}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expanded form */}
      {open && (
        <form onSubmit={handleSubmit} className="bg-white p-5 space-y-6 border-t border-[#D4AF37]/40">
          {/* Section: Organizer */}
          <div>
            <p className={SECTION_HEADING_CLS}>Your information (organizer)</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Full legal name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.organizerName}
                  onChange={(e) => setField("organizerName", e.target.value)}
                  placeholder="Jane Smith"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Phone number <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="(555) 000-0000"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Street address <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.street}
                  onChange={(e) => setField("street", e.target.value)}
                  placeholder="123 Main St"
                  className={INPUT_CLS}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="Los Angeles"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    ZIP <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.zip}
                    onChange={(e) => setField("zip", e.target.value)}
                    placeholder="90001"
                    className={INPUT_CLS}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.organizerState}
                  onChange={(e) => setField("organizerState", e.target.value)}
                  className={INPUT_CLS}
                >
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Registered agent */}
          <div>
            <p className={SECTION_HEADING_CLS}>Registered agent</p>
            <label className="flex items-start gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={form.isSelfAgent}
                onChange={(e) => setField("isSelfAgent", e.target.checked)}
                className="mt-0.5 accent-[#D4AF37] w-4 h-4 shrink-0"
              />
              <span className="text-sm text-gray-700">
                <span className="font-semibold">I&apos;ll be my own registered agent</span>
                <span className="block text-gray-400 text-xs mt-0.5">
                  A registered agent receives legal documents on behalf of your LLC. This can be you.
                </span>
              </span>
            </label>

            {!form.isSelfAgent && (
              <div className="space-y-3 pl-4 border-l-2 border-[#D4AF37]/30">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Agent full name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.agentName}
                    onChange={(e) => setField("agentName", e.target.value)}
                    placeholder="John Doe"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Agent street address <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.agentStreet}
                    onChange={(e) => setField("agentStreet", e.target.value)}
                    placeholder="456 Agent Ave"
                    className={INPUT_CLS}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Agent city <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.agentCity}
                      onChange={(e) => setField("agentCity", e.target.value)}
                      placeholder="Austin"
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Agent ZIP <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.agentZip}
                      onChange={(e) => setField("agentZip", e.target.value)}
                      placeholder="73301"
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Agent state <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.agentState}
                    onChange={(e) => setField("agentState", e.target.value)}
                    className={INPUT_CLS}
                  >
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section: Management structure */}
          <div>
            <p className={SECTION_HEADING_CLS}>Management structure</p>
            <div className="space-y-2">
              {(
                [
                  {
                    value: "member-managed",
                    label: "Member-managed",
                    description: "All owners manage the business day-to-day. Best for most small LLCs.",
                  },
                  {
                    value: "manager-managed",
                    label: "Manager-managed",
                    description:
                      "You appoint one or more managers to run operations. Common when some members are passive investors.",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setField("managementType", opt.value)}
                  className={`w-full text-left border rounded-xl p-4 transition-all ${
                    form.managementType === opt.value
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        form.managementType === opt.value
                          ? "bg-[#D4AF37] border-[#D4AF37]"
                          : "border-gray-300"
                      }`}
                    >
                      {form.managementType === opt.value && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Members */}
          <div>
            <p className={SECTION_HEADING_CLS}>Who owns this LLC?</p>
            <div className="space-y-2">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={member.name}
                    onChange={(e) => updateMember(idx, "name", e.target.value)}
                    placeholder="Full name"
                    className={INPUT_CLS + " flex-1"}
                  />
                  <div className="relative w-24 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={member.ownership}
                      onChange={(e) => updateMember(idx, "ownership", e.target.value)}
                      placeholder="100"
                      className={INPUT_CLS + " pr-6"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMember}
              className="mt-2 text-xs font-semibold text-[#D4AF37] hover:text-[#B8962E] transition-colors"
            >
              + Add member
            </button>

            {members.length > 1 && (
              <p
                className={`mt-2 text-xs font-medium ${
                  ownershipOk ? "text-emerald-600" : "text-red-500"
                }`}
              >
                Total: {Math.round(totalOwnership * 100) / 100}%{!ownershipOk && " — must equal 100%"}
              </p>
            )}
          </div>

          {/* Section: Business purpose */}
          <div>
            <p className={SECTION_HEADING_CLS}>Business purpose</p>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Business purpose</label>
            <textarea
              value={form.businessPurpose}
              onChange={(e) => setField("businessPurpose", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Most LLCs use a general purpose. You can be more specific if you prefer.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isComplete || loading}
            className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Redirecting to checkout…" : `File my LLC — ${price.display}`}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            Cancel
          </button>
        </form>
      )}

      {/* "I'll file it myself" link shown when card is collapsed */}
      {!open && (
        <div className="px-5 pb-4 text-center">
          <button
            type="button"
            onClick={onComplete}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            I&apos;ll file it myself →
          </button>
        </div>
      )}
    </div>
  );
}
