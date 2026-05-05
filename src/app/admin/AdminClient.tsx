"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";

interface FilingDetails {
  managementType?: string;
  isSelfAgent?: boolean;
  organizerState?: string;
  registeredAgent?: { name: string; street: string; city: string; state: string; zip: string } | null;
  members?: Array<{ name: string; ownership: string }>;
  businessPurpose?: string;
}

interface Order {
  id: string;
  business_name: string;
  state: string;
  structure: string;
  organizer_name: string;
  address_line1: string;
  city: string;
  zip: string;
  phone: string;
  user_email: string;
  amount_cents: number;
  details: string | null;
  notes: string;
  confirmation_number: string;
  status: string;
  filed_at: string | null;
  approved_at: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending_payment: { label: "Awaiting payment", bg: "bg-gray-100", text: "text-gray-600" },
  paid:            { label: "Paid — needs filing", bg: "bg-amber-100", text: "text-amber-700" },
  filed:           { label: "Filed — awaiting approval", bg: "bg-blue-100", text: "text-blue-700" },
  approved:        { label: "Approved", bg: "bg-emerald-100", text: "text-emerald-700" },
};

const FILING_PORTALS: Record<string, string> = {
  California: "https://bizfileonline.sos.ca.gov",
  Florida:    "https://dos.myflorida.com/sunbiz",
  "New York": "https://ecorp.dos.ny.gov/",
  Texas:      "https://www.sos.state.tx.us/corp/forms_boc.shtml",
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={copy} className="ml-1.5 text-gray-300 hover:text-[#D4AF37] transition-colors shrink-0">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-400">—</p>
    </div>
  );
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-sm text-gray-800 font-medium">{value}</p>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function OrderCard({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(order.status === "paid");
  const [notes, setNotes] = useState(order.notes || "");
  const [confNum, setConfNum] = useState(order.confirmation_number || "");
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);

  const st = STATUS_CONFIG[order.status] ?? { label: order.status, bg: "bg-gray-100", text: "text-gray-600" };
  const details: FilingDetails = order.details ? (() => { try { return JSON.parse(order.details!); } catch { return {}; } })() : {};
  const portal = FILING_PORTALS[order.state];

  async function updateStatus(status: string) {
    setUpdating(true);
    await fetch("/api/admin/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    });
    setUpdating(false);
    onRefresh();
  }

  async function saveNotes() {
    setSaving(true);
    await fetch("/api/admin/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, notes, confirmation_number: confNum }),
    });
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <p className="font-bold text-gray-900 text-lg">{order.business_name}</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
          </div>
          <p className="text-sm text-gray-500">
            {order.state} · {order.structure.toUpperCase()} · ${(order.amount_cents / 100).toFixed(0)} paid · {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{order.user_email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          {portal && (
            <a
              href={portal}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#B8962E] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              State portal <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-6 space-y-6">
          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contact info</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Organizer name" value={order.organizer_name} />
              <Field label="Address" value={`${order.address_line1}, ${order.city}, ${details.organizerState || ""} ${order.zip}`} />
              <Field label="Phone" value={order.phone || "—"} />
              <Field label="Customer email" value={order.user_email} />
            </div>
          </div>

          {/* Filing details */}
          {Object.keys(details).length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Filing details</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Management" value={details.managementType === "member-managed" ? "Member-managed" : "Manager-managed"} />
                <Field label="Business purpose" value={details.businessPurpose || "Any lawful purpose"} />
                <Field
                  label="Registered agent"
                  value={details.isSelfAgent
                    ? `${order.organizer_name} (self)`
                    : details.registeredAgent
                      ? `${details.registeredAgent.name}, ${details.registeredAgent.street}, ${details.registeredAgent.city}, ${details.registeredAgent.state} ${details.registeredAgent.zip}`
                      : "—"
                  }
                />
              </div>

              {details.members && details.members.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Members / Ownership</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    {details.members.map((m, i) => (
                      <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t border-gray-100" : ""}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{m.name}</span>
                          <CopyButton value={m.name} />
                        </div>
                        <span className="font-bold text-gray-900">{m.ownership}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes & confirmation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Notes & tracking</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirmation number</label>
                <input
                  value={confNum}
                  onChange={e => setConfNum(e.target.value)}
                  placeholder="State-issued confirmation or filing number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Internal notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any notes about this filing, issues encountered, follow-up needed..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none leading-relaxed"
                />
              </div>
              <button
                onClick={saveNotes}
                disabled={saving}
                className="text-sm font-semibold text-[#D4AF37] hover:text-[#B8962E] border border-[#D4AF37]/30 rounded-lg px-4 py-2 transition-colors disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save notes"}
              </button>
            </div>
          </div>

          {/* Status actions */}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-gray-100">
            {order.status === "paid" && (
              <button
                onClick={() => updateStatus("filed")}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                {updating ? "Updating…" : "Mark as filed → notify customer"}
              </button>
            )}
            {order.status === "filed" && (
              <button
                onClick={() => updateStatus("approved")}
                disabled={updating}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                {updating ? "Updating…" : "Mark as approved → notify customer"}
              </button>
            )}
            {order.filed_at && (
              <p className="text-xs text-gray-400">Filed {new Date(order.filed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            )}
            {order.approved_at && (
              <p className="text-xs text-gray-400">Approved {new Date(order.approved_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const needsFiling = orders.filter(o => o.status === "paid").length;
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Filing Orders</h1>
            {needsFiling > 0 && (
              <p className="text-amber-600 text-sm font-semibold mt-0.5">{needsFiling} order{needsFiling > 1 ? "s" : ""} need{needsFiling === 1 ? "s" : ""} filing</p>
            )}
          </div>
          <button onClick={load} className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { value: "all", label: `All (${orders.length})` },
            { value: "paid", label: `Needs filing (${orders.filter(o => o.status === "paid").length})` },
            { value: "filed", label: `Filed (${orders.filter(o => o.status === "filed").length})` },
            { value: "approved", label: `Approved (${orders.filter(o => o.status === "approved").length})` },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === tab.value
                  ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 font-medium">No orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onRefresh={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
