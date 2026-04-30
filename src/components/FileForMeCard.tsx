"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const PRICES: Record<string, { display: string; stateFee: string }> = {
  California: { display: "$149", stateFee: "$70" },
  Florida:    { display: "$199", stateFee: "$125" },
  "New York": { display: "$279", stateFee: "$200" },
  Texas:      { display: "$379", stateFee: "$300" },
};

interface Props {
  state: string;
  structure: string;
  businessName: string;
  companyId: string;
  userEmail: string;
}

export default function FileForMeCard({ state, structure, businessName, companyId, userEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ organizerName: "", addressLine1: "", city: "", zip: "", phone: "" });

  const isComplete = form.organizerName.trim() !== "" && form.addressLine1.trim() !== "" && form.city.trim() !== "" && form.zip.trim() !== "";

  const price = PRICES[state];
  if (!price) return null;

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
        addressLine1: form.addressLine1,
        city: form.city,
        zip: form.zip,
        phone: form.phone,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div className="rounded-xl border-2 border-[#D4AF37]/40 bg-[#D4AF37]/6 overflow-hidden">
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
            Get started <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-[#D4AF37]/40 bg-white p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">A few details so we can file correctly</p>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Your full legal name</label>
            <input
              value={form.organizerName}
              onChange={e => setForm(f => ({ ...f, organizerName: e.target.value }))}
              placeholder="Jane Smith"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Street address</label>
            <input
              value={form.addressLine1}
              onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))}
              placeholder="123 Main St"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
              <input
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="Los Angeles"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ZIP code</label>
              <input
                value={form.zip}
                onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
                placeholder="90001"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone <span className="font-normal text-gray-400">(optional)</span></label>
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="(555) 000-0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isComplete}
            className="w-full bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Redirecting to checkout…" : `Continue to payment — ${price.display}`}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <button type="button" onClick={() => setOpen(false)} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
